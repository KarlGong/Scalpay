﻿using System;
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
using ScalpayApi.Services.Exceptions;

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
            var path = context.Request.Path.ToString();
            if (path.Equals("/api/auth/signIn", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/api/eval/", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            context.Request.Headers.TryGetValue("Scalpay-Api-Key", out var apiKeys);
            if (apiKeys.Any())
            {
                User user = null;
                try
                {
                    user = await userService.GetUserByApiKeyAsync(apiKeys[0]);
                }
                catch (ScalpayException e)
                {
                }

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