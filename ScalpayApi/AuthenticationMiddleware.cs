using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Scalpay.Exceptions;
using Scalpay.Services;

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
            var allowNoneRoleAttribute = context.GetEndpoint()?.Metadata?.GetMetadata<AllowAnonymousAttribute>();
            if (allowNoneRoleAttribute != null)
            {
                await _next(context);
                return;
            }

            context.Request.Headers.TryGetValue("Authorization", out var tokens);
            if (tokens.Any())
            {
                IDictionary<string, object> payload;
                try
                {
                    payload = new JwtBuilder()
                        .WithAlgorithm(new HMACSHA256Algorithm())
                        .WithSecret(configuration["JwtSecret"])
                        .MustVerifySignature()
                        .Decode<IDictionary<string, object>>(tokens[0]);
                }
                catch (TokenExpiredException e)
                {
                    context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    context.Response.ContentType = "text/plain; charset=UTF-8";
                    await context.Response.WriteAsync("Authorization token has expired.");
                    return;
                }
                catch (SignatureVerificationException e)
                {
                    context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    context.Response.ContentType = "text/plain; charset=UTF-8";
                    await context.Response.WriteAsync("Authorization token has invalid signature.");
                    return;
                }

                if (payload.TryGetValue("username", out var username))
                {
                    var claimsIdentity = new ClaimsIdentity(new List<Claim>() {new Claim("username", username.ToString())});
                    var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                    context.User = claimsPrincipal;
                }

                try
                {
                    await userService.GetCurrentUserAsync();
                }
                catch (NotFoundException ex)
                {
                    context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    context.Response.ContentType = "text/plain; charset=UTF-8";
                    await context.Response.WriteAsync(ex.Message); 
                    return;
                }
                
                await _next(context);
            }
            else
            {
                context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                context.Response.ContentType = "text/plain; charset=UTF-8";
                await context.Response.WriteAsync("No authorization token found.");
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