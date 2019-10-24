using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Scalpay.Controllers.DTOs;
using Scalpay.Services;
using Scalpay.Models;
using Scalpay.Services.Parameters;
using Scalpay.Services.Parameters.Criterias;

namespace Scalpay.Controllers
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
        public async Task<Result<UserDTO>> SignIn([FromBody] SignInParams ps)
        {
            var user = await _service.GetUserByUsernamePasswordAsync(ps.Username, ps.Password);
            return new Result<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }
    }
}