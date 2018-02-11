using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ScalpayApi.Models;
using ScalpayApi.Services;
using Microsoft.AspNetCore.Authentication;

namespace ScalpayApi
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        
        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService, IMapper mapper)
        {
            if (context.Request.Path.Equals("/api/auth/signIn"))
            {
                await _next(context);
                return;
            }
            
            context.Request.Headers.TryGetValue("Scalpay-Api-Key", out var apiKeys);
            if (apiKeys.Any())
            {
                var user = await userService.GetUserAsync(new UserCriteria()
                {
                    ApiKey = apiKeys[0]
                });

                if (user != null)
                {
                    var claims = new List<Claim>
                    {
                        new Claim("Username", user.Username),
                        new Claim("Email", user.Email),
                        new Claim("FullName", user.FullName)
                    };
                    var claimsIdentity = new ClaimsIdentity(claims);
                    var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                    context.User = claimsPrincipal;
                    await _next(context);
                    return;
                }
            }
            context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
            context.Response.ContentType = "text/plain";
            await context.Response.WriteAsync("You cannot perform this action, please sign in.");
        }
    }

    public static class AuthenticationMiddlewareExtensions
    {
        public static IApplicationBuilder UseScalpayAuthentication(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationMiddleware>();
        }
    }
}