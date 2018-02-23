using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ScalpayApi.Controllers.DTOs;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    public class SignInParams
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly HttpContext _httpContext;
        private readonly IUserService _service;
        private readonly IMapper _mapper;

        public AuthController(IHttpContextAccessor accessor, IUserService service, IMapper mapper)
        {
            _httpContext = accessor.HttpContext;
            _service = service;
            _mapper = mapper;
        }

        [HttpPost("signIn")]
        public async Task<UserDTO> SignIn([FromBody] SignInParams ps)
        {
            var user = await _service.GetUserAsync(new UserCriteria()
            {
                Username = ps.Username,
                Password = ps.Password
            });

            return _mapper.Map<UserDTO>(user);
        }

        [HttpGet("newApiKey")]
        public async Task<UserDTO> GenerateNewKey()
        {
            var user = await _service.GenerateNewApiKeyAsync(
                await _service.GetUserAsync(_httpContext.User.FindFirstValue("Username")));

            return _mapper.Map<UserDTO>(user);
        }
    }
}