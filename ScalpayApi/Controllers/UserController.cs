using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;
using Scalpay.Services.UserService;

namespace Scalpay.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly User _user;
        private readonly IUserService _service;
        private readonly IMapper _mapper;

        public UserController(IHttpContextAccessor accessor, IUserService service, IMapper mapper)
        {
            _user = service.GetUserAsync(accessor.HttpContext.User.FindFirstValue("username")).Result;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet()]
        public async Task<ListResults<User>> GetUsers([FromQuery] UserCriteria criteria)
        {
            var usersList = await _service.GetUsersAsync(criteria);
            foreach (var user in usersList.Data)
            {
                user.Password = null;
            }

            return usersList;
        }

        [HttpGet("{username}")]
        public async Task<User> GetUser([FromRoute] string username)
        {
            var user = await _service.GetUserAsync(username);
            user.Password = null;

            return user;
        }

        [HttpPut()]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            if (!_user.Role.Equals(UserRole.Admin))
            {
                return Forbid("You cannot add user.");
            }

            return Ok(await _service.AddUserAsync(user));
        }

        [HttpPost("{username}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string username, [FromBody] User user)
        {
            if (!_user.Role.Equals(UserRole.Admin) && _user.Username != username)
            {
                return Forbid("You cannot edit user.");
            }

            user.Username = username;
            return Ok(await _service.UpdateUserAsync(user));
        }
    }
}