using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services.ExpressionService;
using Scalpay.Services.ItemService;
using Scalpay.Services.ProjectService;
using Scalpay.Services.UserService;
using Serilog;

namespace Scalpay
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration).CreateLogger();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().AddJsonOptions(
                options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                }
            );

            services.AddAutoMapper(config =>
            {
                config.AllowNullCollections = true;
                config.AllowNullDestinationValues = true;
                config.CreateMissingTypeMaps = true;
                config.ValidateInlineMaps = false;
                // fix mapping same type
                config.CreateMap<Project, Project>();
                config.CreateMap<Item, Item>();
            });

            services.AddDbContextPool<ScalpayDbContext>(options =>
            {
                var dbType = Configuration.GetSection("Database")["Type"];
                var connectionStrings = Configuration.GetSection("Database")["ConnectionStrings"];
                switch (dbType)
                {
                    case "mysql":
                        options.UseMySql(connectionStrings);
                        break;
                    case "sqlite":
                        options.UseSqlite(connectionStrings);
                        break;
                    default:
                        options.UseSqlite("Data Source=sqlite.db;");
                        break;
                }
            });

            services.AddMemoryCache();

            services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IExpressionService, ExpressionService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IUserService, UserService>();

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            InitApplication(serviceProvider);

            loggerFactory.AddSerilog();

            app.UseScalpayException();

            app.UseScalpayRewrite();

            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseScalpayAuthentication();

            app.UseMvc();
        }

        public void InitApplication(IServiceProvider serviceProvider)
        {
            // json.net default settings
            JsonConvert.DefaultSettings = (() =>
            {
                var settings = new JsonSerializerSettings();
                settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                settings.NullValueHandling = NullValueHandling.Ignore;
                settings.Converters.Add(new StringEnumConverter());
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                return settings;
            });

            // init database
            var context = serviceProvider.GetService<ScalpayDbContext>();

            context.Database.Migrate();

            // add default user
            if (!context.Users.Any())
            {
                context.Users.Add(new User()
                {
                    Username = "admin",
                    Email = "admin@scalpay.com",
                    FullName = "Admin",
                    Password = "1",
                    Role = Role.Admin,
                    InsertTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });
                context.SaveChanges();
            }

            // add scalpay project
            if (!context.Projects.Any())
            {
                context.Projects.Add(new Project()
                {
                    ProjectKey = "__scalpay",
                    Description = "The Scalpay's configurations.",
                    InsertTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });
                context.SaveChanges();
            }
        }
    }
}