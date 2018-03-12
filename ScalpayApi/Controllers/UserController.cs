using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Controllers.DTOs;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Controllers
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
        public async Task<Result<List<UserDTO>>> GetUsers([FromQuery] UserCriteria criteria)
        {
            return new Result<List<UserDTO>>()
            {
                Data = _mapper.Map<List<UserDTO>>(await _service.GetUsersAsync(criteria)),
                TotalCount = await _service.GetUsersCountAsync(criteria)
            };
        }

        [HttpGet("{username}")]
        public async Task<Result<UserDTO>> GetUser([FromRoute] string username)
        {
            var user = await _service.GetUserByUsernameAsync(username);

            return new Result<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        [HttpPut]
        [Authorization(Privilege.UserManage)]
        public async Task<Result<UserDTO>> AddUser([FromBody] AddUserParams ps)
        {
            var user = await _service.AddUserAsync(ps);

            return new Result<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        [HttpPost("{username}")]
        [Authorization(Privilege.UserManage)]
        public async Task<Result<UserDTO>> UpdateUser([FromRoute] string username, [FromBody] UpdateUserParams ps)
        {
            ps.Username = username;
            var user = await _service.UpdateUserAsync(ps);

            return new Result<UserDTO>()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        [HttpDelete("{username}")]
        [Authorization(Privilege.UserManage)]
        public async Task<Result> DeleteUser([FromRoute] string username)
        {
            await _service.DeleteUserAsync(username);
            return new Result();
        }
    }
}