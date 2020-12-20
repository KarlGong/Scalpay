using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Scalpay.Exceptions;
using Scalpay.Services;

namespace Scalpay
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        private static readonly Dictionary<Type, HttpStatusCode> EXCEPTION_STATUS_CODE_MAP =
            new Dictionary<Type, HttpStatusCode>()
            {
                {typeof(InvalidParamsException), HttpStatusCode.BadRequest},
                {typeof(NotFoundException), HttpStatusCode.NotFound},
                {typeof(ConflictException), HttpStatusCode.Conflict},
            };

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (EXCEPTION_STATUS_CODE_MAP.TryGetValue(ex.GetType(), out var code))
                {
                    context.Response.StatusCode = (int) code;
                    context.Response.ContentType = "text/plain; charset=UTF-8";
                    await context.Response.WriteAsync(ex.Message);
                }
                else
                {
                    context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "text/plain; charset=UTF-8";
                    await context.Response.WriteAsync(ex.Message);
                    throw;
                }
            }
        }
    }

    public static class ExceptionMiddlewareExtension
    {
        public static IApplicationBuilder UseScalpayException(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }
}