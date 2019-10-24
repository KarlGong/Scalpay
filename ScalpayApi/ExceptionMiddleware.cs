using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ScalpayApi.Exceptions;
using ScalpayApi.Services;

namespace ScalpayApi
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        private static readonly Dictionary<Type, HttpStatusCode> EXCEPTION_STATUS_CODE_MAP =
            new Dictionary<Type, HttpStatusCode>()
            {
                {typeof(NotFoundException), HttpStatusCode.NotFound}
            };

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService, IMapper mapper)
        {
            try
            {
                await _next(context);
            }
            catch (ScalpayException ex)
            {
                if (EXCEPTION_STATUS_CODE_MAP.TryGetValue(ex.GetType(), out var code))
                {
                    context.Response.StatusCode = (int) code;
                    await context.Response.WriteAsync(ex.Message);
                }
                else
                {
                    throw;
                }
            }
        }
    }

    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseScalpayException(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }
}