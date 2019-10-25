using System;
using System.Threading.Tasks;
using AutoMapper;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Scalpay.Services.UserService;

namespace Scalpay.Controllers
{
    public class SignInParams
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime ExpiredTime { get; set; } = DateTime.UtcNow.AddDays(1);
    }

    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly HttpContext _httpContext;
        private readonly IUserService _service;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthController(IHttpContextAccessor accessor, IUserService service, IMapper mapper, IConfiguration configuration)
        {
            _httpContext = accessor.HttpContext;
            _service = service;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpPost("signIn")]
        public async Task<object> SignIn([FromBody] SignInParams ps)
        {
            var user = await _service.GetUserAsync(new UserCriteria()
            {
                Username = ps.Username,
                Password = ps.Password
            });
            return new
            {
                Token = new JwtBuilder().WithAlgorithm(new HMACSHA256Algorithm()).WithSecret(_configuration["JwtSecret"])
                    .AddClaim("exp", new DateTimeOffset(ps.ExpiredTime).ToUnixTimeSeconds())
                    .AddClaim("username", user.Username)
                    .Build()
            };
        }
    }
}