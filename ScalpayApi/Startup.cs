using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
using Scalpay.Services;
using Serilog;
using ILogger = Serilog.ILogger;

namespace Scalpay
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(
                options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                }
            );
            
            services.AddAutoMapper(config =>
            {
                config.AllowNullCollections = true;
                config.AllowNullDestinationValues = true;
                // config.CreateMissingTypeMaps = true;
                // config.ValidateInlineMaps = false;
                // fix mapping same type
                config.CreateMap<UpsertProjectParams, Project>();
                config.CreateMap<UpsertItemParams, Item>();
                config.CreateMap<UpsertProjectPermissionParams, ProjectPermission>();
                config.CreateMap<UpsertUserParams, User>();
                config.CreateMap<User, UpsertUserParams>();
            });

            services.AddDbContextPool<ScalpayDbContext>(options =>
            {
                var connectionStrings = Configuration.GetSection("Database")["ConnectionString"];
                options.UseMySql(connectionStrings);
            });

            services.AddMemoryCache();
            services.AddHttpContextAccessor();

            services.AddScoped<IEvalService, EvalService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IProjectPermissionService, ProjectPermissionService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPermissionService, PermissionService>();

            services.AddSingleton<ILogger>(new LoggerConfiguration().ReadFrom.Configuration(Configuration).CreateLogger());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, ScalpayDbContext dbContext, ILogger logger)
        {
            InitApplication(dbContext, env);

            loggerFactory.AddSerilog(logger);

            app.UseScalpayException();

            app.UseRouting();

            app.UseScalpayAuthentication();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
        
        public void InitApplication(ScalpayDbContext context, IWebHostEnvironment env)
        {
            // json.net default settings
            JsonConvert.DefaultSettings = (() =>
            {
                var settings = new JsonSerializerSettings();
                settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                settings.NullValueHandling = NullValueHandling.Ignore;
                settings.Converters.Add(new StringEnumConverter());
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                settings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                return settings;
            });

            // init database
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
                    Role = Role.Admin
                });
                context.SaveChanges();
            }

            // add scalpay project
            if (!context.Projects.Any())
            {
                context.Projects.Add(new Project()
                {
                    ProjectKey = "__scalpay",
                    Description = "The Scalpay's configurations."
                });
                context.SaveChanges();
            }
        }
    }
}