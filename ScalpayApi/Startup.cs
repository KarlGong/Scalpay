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
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
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

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddTransient<IItemService, ItemService>();
            services.AddTransient<IConfigItemService, ConfigItemService>();
            services.AddTransient<IWordItemService, WordItemService>();
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IExpressionService, ExpressionService>();

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            InitApplication(serviceProvider);
            
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            
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
                return settings;
            });
            
            // init database
            using (var context = serviceProvider.GetService<ScalpayDbContext>())
            {
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

                const string scalpayKey = "__scalpay";
                // add scalpay project
                if (!context.Projects.Any())
                {
                    context.Projects.Add(new Project()
                    {
                        ProjectKey = scalpayKey,
                        Name = scalpayKey,
                        Description = "The Scalpay's configurations and words.",
                        Items = new List<Item>()
                        {
                            new ConfigItem()
                            {
                                ItemKey = $"config.{scalpayKey}.word_item.languages",
                                Name = "Word Item Languages",
                                Description = "The look up for word item languages.",
                                ProjectKey = scalpayKey,
                                Mode = ConfigItemMode.Property,
                                ResultDataType = SDataType.StringDict,
                                DefaultResult = new SExpression()
                                {
                                    ReturnType = SDataType.StringDict,
                                    ExpType = SExpressionType.Value,
                                    Value = JToken.FromObject(new Dictionary<string, string>()
                                    {
                                        {"Deutsch", "de"},
                                        {"English", "en"},
                                        {"español", "es"},
                                        {"español (Latinoamérica)", "es-419"},
                                        {"français", "fr"},
                                        {"hrvatski", "hr"},
                                        {"italiano", "it"},
                                        {"Nederlands", "nl"},
                                        {"polski", "pl"},
                                        {"português (Brasil)", "pt-BR"},
                                        {"português (Portugal)", "pt-PT"},
                                        {"Tiếng Việt", "vi"},
                                        {"Türkçe", "tr"},
                                        {"русский", "ru"},
                                        {"العربية", "ar"},
                                        {"ไทย", "th"},
                                        {"한국어", "ko"},
                                        {"中文 (简体)", "zh-CN"},
                                        {"中文 (繁體)", "zh-TW"},
                                        {"日本語", "ja"}
                                    })
                                }
                            }
                        }
                    });
                    context.SaveChanges();
                }
            }
        }
    }
}