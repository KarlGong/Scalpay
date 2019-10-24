using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ScalpayApi
{
    public class RewriteMiddleware
    {
        private static readonly Regex ApiRegex = new Regex("^/api/.*$");

        private static readonly string[] MobileKeywords = new[]
        {
            "Android", "iPhone", "iPad"
        };

        private readonly RequestDelegate _next;
        private readonly IHostingEnvironment _hostingEnvironment;

        public RewriteMiddleware(RequestDelegate next, IHostingEnvironment hostingEnvironment)
        {
            _next = next;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task Invoke(HttpContext context)
        {
            if (ApiRegex.IsMatch(context.Request.Path))
            {
                await _next(context);
                return;
            }

            var userAgent = context.Request.Headers["User-Agent"].ToString();

            var root = MobileKeywords.Any(keyword => userAgent.Contains(keyword)) ? "/wap" : "/web";

            if (new[] {"GET", "HEAD"}.Contains(context.Request.Method, StringComparer.OrdinalIgnoreCase)
                && !File.Exists(Path.Join(_hostingEnvironment.WebRootPath, root, context.Request.Path.ToString())))
            {
                context.Request.Path = root + "/index.html";
            }
            else
            {
                context.Request.Path = root + context.Request.Path;
            }

            await _next(context);
        }
    }

    public static class RewriteMiddlewareExtensions
    {
        public static IApplicationBuilder UseScalpayRewrite(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RewriteMiddleware>();
        }
    }
}