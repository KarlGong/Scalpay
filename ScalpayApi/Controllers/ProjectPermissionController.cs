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
    public class ProjectPermissionODataController: ODataController
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;

        public ProjectPermissionODataController(ScalpayDbContext context, IUserService userService, IProjectPermissionService permissionService)
        {
            _context = context;
            _permissionService = permissionService;
            _user = userService.GetCurrentUserAsync().Result;
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("projects/{projectId}/permissions")]
        public async Task<IActionResult> GetPermissions([FromRoute] string projectId)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission == Permission.Admin))
            {
                return Forbid("You have no permission to permission in this project.");
            }
            
            return Ok(_context.ProjectPermissions.Where(i => i.ProjectId == projectId));
        }
        
    }
    
    [Route("api/projects")]
    public class ProjectPermissionController: Controller
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;

        public ProjectPermissionController(ScalpayDbContext context, IUserService service, IProjectPermissionService permissionService)
        {
            _context = context;
            _user = service.GetCurrentUserAsync().Result;
            _permissionService = permissionService;
        }
        
        [HttpPost("{projectId}/permissions")]
        public async Task<IActionResult> GetProjectPermissions([FromRoute] string projectId, [FromBody] UpsertProjectPermissionParams ps)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission == Permission.Admin))
            {
                return Forbid("You have no permission to view project permissions.");
            }

            ps.ProjectId = projectId;
            return Ok(await _permissionService.UpdateProjectPermissionAsync(ps));
        }
    }
}