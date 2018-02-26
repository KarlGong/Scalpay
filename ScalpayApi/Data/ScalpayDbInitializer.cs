using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public static class ScalpayDbInitializer
    {
        public static void InitScalpayDb(this IApplicationBuilder app)
        {
            var scopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();

            using (var scope = scopeFactory.CreateScope())
            using (var context = scope.ServiceProvider.GetRequiredService<ScalpayDbContext>())
            {
                context.Database.Migrate();
                
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
            }
        }
    }
}