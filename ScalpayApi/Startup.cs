using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;
using Serilog;

namespace ScalpayApi
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
            services.AddMvc(
                options => options.Filters.Add(typeof(AuthorizationFilter))
            ).AddJsonOptions(
                options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter(false));
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                }
            );

            services.AddAutoMapper(config =>
            {
                config.AllowNullCollections = true;
                config.AllowNullDestinationValues = true;
                config.CreateMissingTypeMaps = true;
                config.ValidateInlineMaps = false;
            });

            services.AddDbContextPool<ScalpayDbContext>(options =>
                options.UseMySql(Configuration.GetConnectionString("mysql")));

            services.AddMemoryCache();

            services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IExpressionService, ExpressionService>();
            services.AddScoped<IAuditService, AuditService>();

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory,
            IServiceProvider serviceProvider)
        {
            InitApplication(serviceProvider);

            loggerFactory.AddSerilog();

            app.UseScalpayException();

            app.UseScalpayAuthentication();

            app.UseStaticFiles();

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
                settings.Converters.Add(new StringEnumConverter(false));
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
                    ApiKey = Guid.NewGuid().ToString(),
                    Email = "admin@scalpay.com",
                    FullName = "Admin",
                    Password = "1",
                    Privileges = Enum.GetValues(typeof(Privilege)).Cast<Privilege>().ToList()
                });
                context.SaveChanges();
            }

            // add scalpay project
            if (!context.Projects.Any())
            {
                context.Projects.Add(new Project()
                {
                    ProjectKey = "__scalpay",
                    Name = "Scalpay",
                    Description = "The Scalpay's configurations.",
                    Version = 1,
                    IsLatest = true
                });
                context.SaveChanges();
            }
        }
    }
}