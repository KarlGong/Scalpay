using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    public class UpdateUserPasswordParams
    {
        public string CurrentPassword { get; set; }
        
        public string NewPassword { get; set; }
    }
    
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IPermissionService _permissionService;
        private readonly User _user;
        private readonly IUserService _service;

        public UserController(IMapper mapper, IPermissionService permissionService, IUserService service)
        {
            _mapper = mapper;
            _permissionService = permissionService;
            _user = service.GetCurrentUserAsync().Result;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserCriteria criteria)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Read))
            {
                return StatusCode(403, "You have no permission to view users.");
            }

            return Ok(await _service.GetUsersAsync(criteria));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser([FromRoute] string username)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Read))
            {
                return StatusCode(403, "You have no permission to view this user.");
            }

            return Ok(await _service.GetUserAsync(username));
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UpsertUserParams ps)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Admin))
            {
                return StatusCode(403, "You have no permission to add user.");
            }

            return Ok(await _service.AddUserAsync(ps));
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string username, [FromBody] UpsertUserParams ps)
        {
            if (!(await _permissionService.HasGlobalPermissionAsync(Permission.Admin) || _user.Username == username))
            {
                return StatusCode(403, "You have no permission to update this user.");
            }

            ps.Username = username;
            ps.Password = (await _service.GetUserAsync(username)).Password;
            return Ok(await _service.UpdateUserAsync(ps));
        }
        
        [HttpPatch("{username}/password")]
        public async Task<IActionResult> UpdateUserPassword([FromRoute] string username, [FromBody] UpdateUserPasswordParams ps)
        {
            if (_user.Username != username)
            {
                return StatusCode(403, "You have no permission to update password of this user.");
            }
            
            var user = await _service.GetUserAsync(username);

            if (user.Password != ps.CurrentPassword)
            {
                throw new InvalidParamsException("Current password is incorrect.");
            }

            var upsertUserParams = _mapper.Map<UpsertUserParams>(user);
            upsertUserParams.Password = ps.NewPassword;

            return Ok(await _service.UpdateUserAsync(upsertUserParams));
        }
    }
}