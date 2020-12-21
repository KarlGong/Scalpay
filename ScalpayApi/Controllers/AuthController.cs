using System;
using System.Threading.Tasks;
using AutoMapper;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    public class SignInByUsernameParams
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime Expiration { get; set; } = DateTime.UtcNow.AddDays(1);
    }

    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IUserService _service;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }

        [HttpPost("username")]
        [AllowAnonymous]
        public async Task<IActionResult> SignInByUsername([FromBody] SignInByUsernameParams ps)
        {
            if (string.IsNullOrEmpty(ps.Username))
            {
                return Unauthorized("Username cannot be empty.");
            }

            if (string.IsNullOrEmpty(ps.Password))
            {
                return Unauthorized("Password cannot be empty.");
            }

            User user = null;
            try
            {
                user = await _service.GetUserByUsernameAndPasswordAsync(ps.Username, ps.Password);
            }
            catch (NotFoundException ex)
            {
                return Unauthorized("Username and password are incorrect.");
            }

            return Ok(new
            {
                Token = new JwtBuilder().WithAlgorithm(new HMACSHA256Algorithm()).WithSecret(_configuration["JwtSecret"])
                    .AddClaim("exp", new DateTimeOffset(ps.Expiration).ToUnixTimeSeconds())
                    .AddClaim("username", user.Username)
                    .Encode(),
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            });
        }
    }
}