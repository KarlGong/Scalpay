using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    public class ProjectODataController: ODataController
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;

        public ProjectODataController(ScalpayDbContext context, IUserService userService, IProjectPermissionService permissionService)
        {
            _context = context;
            _permissionService = permissionService;
            _user = userService.GetCurrentUserAsync().Result;
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("projects")]
        public IActionResult GetProjects()
        {
            if (!(_user.Role.Equals(Role.Admin)))
            {
                return Forbid("You have no permission to view this project.");
            }
            
            return Ok(_context.Items);
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("projects/{projectId}")]
        public async Task<IActionResult> GetProject([FromRoute] string projectId)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission != Permission.None))
            {
                return Forbid("You have no permission to view this project.");
            }
            return Ok(_context.Items.Where(i => i.ProjectId == projectId));
        }
    }
    
    [Route("api/projects")]
    public class ProjectController : Controller
    {
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;
        private readonly IProjectService _projectService;

        public ProjectController(IUserService userService, IProjectPermissionService permissionService, IProjectService projectService)
        {
            _user = userService.GetCurrentUserAsync().Result;
            _permissionService = permissionService;
            _projectService = projectService;
        }

        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] UpsertProjectParams ps)
        {
            if (!_user.Role.Equals(Role.Admin))
            {
                return Forbid("You have no permission to add project.");
            }
            
            return Ok(await _projectService.AddProjectAsync(ps));
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject([FromRoute] string projectId, [FromBody] UpsertProjectParams ps)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetProjectPermissionAsync(projectId, _user.Id)).Permission == Permission.Admin))
            {
                return Forbid("You have no permission to update this project.");
            }

            ps.Id = projectId;
            return Ok(await _projectService.UpdateProjectAsync(ps));
        }
    }
}