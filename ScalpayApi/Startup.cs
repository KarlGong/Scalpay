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
using ScalpayApi.Data;
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
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(
                options => options.Filters.Add(typeof(AuthorizationFilter))
            ).AddJsonOptions(
                options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
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
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IUserService, UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            app.UseScalpayAuthentication();

            app.UseDeveloperExceptionPage();

            app.UseStaticFiles();

            app.UseMvc();
        }
    }
}