using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Controllers.DTOs;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/users")]
    public class UserController: Controller
    {
        private readonly IUserService _service;
        private readonly IMapper _mapper;

        public UserController(IUserService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorization(Privilege.UserViewAll)]
        public async Task<List<UserDTO>> GetUsers()
        {
            return _mapper.Map<List<UserDTO>>(await _service.GetUsersAsync());
        }

        [HttpGet("{userName}")]
        [Authorization(Privilege.UserView)]
        public async Task<UserDTO> GetUser([FromRoute] string userName)
        {
            var user = await _service.GetUserAsync(userName);

            return _mapper.Map<UserDTO>(user);
        }

        [HttpPut]
        [Authorization(Privilege.UserAdd)]
        public async Task<UserDTO> AddUser([FromBody] AddUserParams ps)
        {
            var user = await _service.AddUserAsync(ps);

            return _mapper.Map<UserDTO>(user);
        }

        [HttpPost("{userName}")]
        [Authorization(Privilege.UserEdit)]
        public async Task<UserDTO> UpdateUser([FromRoute] string userName, [FromBody] UpdateUserParams ps)
        {
            ps.UserName = userName;
            var user = await _service.UpdateUserAsync(ps);

            return _mapper.Map<UserDTO>(user);
        }

        [HttpDelete("{userName}")]
        [Authorization(Privilege.UserDelete)]
        public async Task DeleteUser([FromRoute] string userName)
        {
            await _service.DeleteUserAsync(userName);
        }
    }
}