using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Models;
using Scalpay.Services;
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
        public async Task<User> AddUser([FromBody] User user)
        {
            return await _service.AddUserAsync(user);
        }

        [HttpPost("{username}")]
        public async Task<User> UpdateUser([FromRoute] string username, [FromBody] User user)
        {
            user.Username = username;
            return await _service.UpdateUserAsync(user);
        }
    }
}