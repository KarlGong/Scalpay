using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ScalpayApi.Controllers;
using ScalpayApi.Services;
using ScalpayApi.Services.Exceptions;
using ScalpayApi.Services.Parameters.Criterias;
using Serilog;

namespace ScalpayApi
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

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
            catch (ScalpayException e)
            {
                Log.Error(e, $"Error Code: {(int) e.StatusCode}");
                
                context.Response.Clear();
                context.Response.ContentType = @"application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync(JsonConvert.SerializeObject(new Result()
                {
                    StatusCode = (int) e.StatusCode,
                    Message = e.Message
                }));
            }
        }
    }

    public static class ResultMiddlewareExtensions
    {
        public static IApplicationBuilder UseScalpayException(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }
}