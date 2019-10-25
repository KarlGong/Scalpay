using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using JWT;
using JWT.Builder;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Scalpay.Services.UserService;

namespace Scalpay
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService, IConfiguration configuration)
        {
            var path = context.Request.Path.ToString();
            if (path.Equals("/api/auth/signIn", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            context.Request.Headers.TryGetValue("Authorization", out var tokens);
            if (tokens.Any())
            {
                IDictionary<string, object> json;
                try
                {
                    json = new JwtBuilder().WithSecret(configuration["JwtSecret"]).MustVerifySignature().Decode<IDictionary<string, object>>(tokens[0]);
                }
                catch (TokenExpiredException e)
                {
                    context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    context.Response.ContentType = "text/plain";
                    await context.Response.WriteAsync("Token has expired.");
                    return;
                }
                catch (SignatureVerificationException e)
                {
                    context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    context.Response.ContentType = "text/plain";
                    await context.Response.WriteAsync("Token has invalid signature.");
                    return;
                }

                var claimsIdentity = new ClaimsIdentity(json.Select(pair => new Claim(pair.Key, pair.Value.ToString())));
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                context.User = claimsPrincipal;
                await _next(context);
            }
            else
            {
                context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("No token found.");
            }
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