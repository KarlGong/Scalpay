using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper.Internal;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Scalpay.Exceptions;
using Scalpay.Models;

namespace Scalpay
{
    public class ODataResultRewriteMiddleware
    {
        private static readonly Dictionary<string, Func<string, string, string>> ODATA_ROUTE_REWRITER = new Dictionary<string, Func<string, string, string>>()
        {
            {
                "users", (body, id) =>
                {
                    var res = JsonConvert.DeserializeObject<ODataResponse<User>>(body);

                    // /api/odata/xxx
                    if (string.IsNullOrEmpty(id))
                    {
                        return JsonConvert.SerializeObject(new
                        {
                            TotalCount = res.TotalCount,
                            Value = res.Value
                        });
                    }

                    // /api/odata/xxx/1
                    if (!res.Value.Any())
                    {
                        throw new NotFoundException($"User {id} doesn't exist.");
                    }

                    return JsonConvert.SerializeObject(res.Value[0]);
                }
            },
            {
                "projects", (body, id) =>
                {
                    var res = JsonConvert.DeserializeObject<ODataResponse<Project>>(body);

                    // /api/odata/xxx
                    if (string.IsNullOrEmpty(id))
                    {
                        return JsonConvert.SerializeObject(new
                        {
                            TotalCount = res.TotalCount,
                            Value = res.Value
                        });
                    }

                    // /api/odata/xxx/1
                    if (!res.Value.Any())
                    {
                        throw new NotFoundException($"Project {id} doesn't exist.");
                    }

                    return JsonConvert.SerializeObject(res.Value[0]);
                }
            },
            {
                "items", (body, id) =>
                {
                    var res = JsonConvert.DeserializeObject<ODataResponse<Item>>(body);

                    // /api/odata/xxx
                    if (string.IsNullOrEmpty(id))
                    {
                        return JsonConvert.SerializeObject(new
                        {
                            TotalCount = res.TotalCount,
                            Value = res.Value
                        });
                    }

                    // /api/odata/xxx/1
                    if (!res.Value.Any())
                    {
                        throw new NotFoundException($"Item {id} doesn't exist.");
                    }

                    return JsonConvert.SerializeObject(res.Value[0]);
                }
            },
        };

        private readonly RequestDelegate _next;

        public ODataResultRewriteMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var request = context.Request;
            var requestStr = $"{request.Method} {request.Path}".ToLower();

            var match = new Regex(@"^get /api/odata/([^/]+)/?([^/]*)$").Match(requestStr);
            if (match.Success)
            {
                await RewriteBody(context, async body =>
                {
                    var odataRoute = match.Groups[1].Value;
                    if (ODATA_ROUTE_REWRITER.ContainsKey(odataRoute))
                    {
                        return ODATA_ROUTE_REWRITER.GetOrDefault(odataRoute)(body, match.Groups[2].Value);
                    }

                    return body;
                });
            }
            else
            {
                await _next(context);
            }
        }

        private async Task RewriteBody(HttpContext context, Func<string, Task<string>> rewriteBodyFunc)
        {
            var oldBody = context.Response.Body;

            var newBody = new MemoryStream();
            context.Response.Body = newBody;

            try
            {
                await _next(context);
            }
            finally
            {
                context.Response.Body = oldBody;
            }

            newBody.Seek(0, SeekOrigin.Begin);
            var newContent = await new StreamReader(newBody).ReadToEndAsync();
            if (context.Response.StatusCode == StatusCodes.Status200OK)
            {
                newContent = await rewriteBodyFunc(newContent);
            }

            await context.Response.WriteAsync(newContent);
        }
    }


    public static class ODataResultRewriteMiddlewareExtension
    {
        public static IApplicationBuilder UseODataResultRewrite(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ODataResultRewriteMiddleware>();
        }
    }

    public class ODataResponse<T>
    {
        [JsonProperty("@odata.context")] public string Context { get; set; }

        [JsonProperty("@odata.count")] public long? TotalCount { get; set; }

        public List<T> Value { get; set; }
    }
}