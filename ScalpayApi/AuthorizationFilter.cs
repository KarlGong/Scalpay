using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using ScalpayApi.Services;

namespace ScalpayApi
{
    public class AuthorizationFilter : IAsyncActionFilter
    {
        private readonly IUserService _service;

        public AuthorizationFilter(IUserService service)
        {
            _service = service;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor action)
            {
                if (action.MethodInfo.GetCustomAttribute(typeof(AuthorizationAttribute)) is AuthorizationAttribute
                    attribute)
                {
                    var username = context.HttpContext.User.FindFirstValue("Username");

                    var user = await _service.GetUserByUsernameAsync(username);

                    if (user.Privileges.Intersect(attribute.Privileges).Count() != attribute.Privileges.Count())
                    {
                        context.HttpContext.Response.StatusCode = (int) HttpStatusCode.Forbidden;
                        context.HttpContext.Response.ContentType = "text/plain";
                        await context.HttpContext.Response.WriteAsync(
                            "You do not have a privilege to perform this action, please contact your administrator.");
                        return;
                    }
                }
            }
            await next();
        }
    }
}