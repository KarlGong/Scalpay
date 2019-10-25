using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Controllers.DTOs;
using Scalpay.Enums;
using Scalpay.Services;
using Scalpay.Services.Parameters;
using Scalpay.Services.UserService;

namespace Scalpay.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly IUserService _service;
        private readonly IMapper _mapper;

        public UserController(IUserService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorization(Privilege.UserManage)]
        public async Task<ListResults<List<UserDTO>>> GetUsers([FromQuery] UserCriteria criteria)
        {
            return new ListResults<List<UserDTO>>()
            {
                Data = _mapper.Map<List<UserDTO>>(await _service.GetUsersAsync(criteria)),
                TotalCount = await _service.GetUsersCountAsync(criteria)
            };
        }

        [HttpGet("{username}")]
        public async Task<ListResults<UserDTO>> GetUser([FromRoute] string username)
        {
            var user = await _service.GetUserByUsernameAsync(username);

            return new ListResults<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        [HttpPut]
        [Authorization(Privilege.UserManage)]
        public async Task<ListResults<UserDTO>> AddUser([FromBody] AddUserParams ps)
        {
            var user = await _service.AddUserAsync(ps);

            return new ListResults<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        [HttpPost("{username}")]
        [Authorization(Privilege.UserManage)]
        public async Task<ListResults<UserDTO>> UpdateUser([FromRoute] string username, [FromBody] UpdateUserParams ps)
        {
            ps.Username = username;
            var user = await _service.UpdateUserAsync(ps);

            return new ListResults<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }
        
        [HttpPost("{username}/password")]
        public async Task<ListResults<UserDTO>> UpdatePassword([FromRoute] string username, [FromBody] UpdatePasswordParams ps)
        {
            ps.Username = username;
            var user = await _service.UpdatePasswordAsync(ps);

            return new ListResults<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }
    }
}