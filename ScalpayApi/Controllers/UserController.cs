using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    public class UserODataController : ODataController
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;

        public UserODataController(ScalpayDbContext context, IUserService service)
        {
            _context = context;
            _user = service.GetCurrentUserAsync().Result;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("users")]
        public IActionResult GetUsers()
        {
            if (!_user.Role.Equals(Role.Admin))
            {
                return Forbid("You have no permission to view users.");
            }
            
            return Ok(_context.Users);
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("users/{id}")]
        public IActionResult GetUser([FromRoute] int id)
        {
            return Ok(_context.Users.Where(u => u.Id == id));
        }
    }

    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly User _user;
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _user = service.GetCurrentUserAsync().Result;
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UpsertUserParams ps)
        {
            if (!_user.Role.Equals(Role.Admin))
            {
                return Forbid("You have no permission to add user.");
            }

            return Ok(await _service.AddUserAsync(ps));
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] UpsertUserParams ps)
        {
            if (!(_user.Role.Equals(Role.Admin) || _user.Id == id))
            {
                return Forbid("You have no permission to update this user.");
            }

            return Ok(await _service.UpdateUserAsync(id, ps));
        }
    }
}