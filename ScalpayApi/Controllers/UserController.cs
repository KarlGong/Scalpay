using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly IPermissionService _permissionService;
        private readonly User _user;
        private readonly IUserService _service;

        public UserController(IPermissionService permissionService, IUserService service)
        {
            _permissionService = permissionService;
            _user = service.GetCurrentUserAsync().Result;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserCriteria criteria)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Admin))
            {
                return Forbid("You have no permission to view users.");
            }

            return Ok(await _service.GetUsersAsync(criteria));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser([FromRoute] string username)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Read))
            {
                return Forbid("You have no permission to view this user.");
            }

            return Ok(await _service.GetUserAsync(username));
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UpsertUserParams ps)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Admin))
            {
                return Forbid("You have no permission to add user.");
            }

            return Ok(await _service.AddUserAsync(ps));
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string username, [FromBody] UpsertUserParams ps)
        {
            if (!(await _permissionService.HasGlobalPermissionAsync(Permission.Admin) || _user.Username == username))
            {
                return Forbid("You have no permission to update this user.");
            }

            ps.Username = username;
            return Ok(await _service.UpdateUserAsync(ps));
        }
    }
}