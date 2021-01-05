using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    [Route("api/projects")]
    public class ProjectPermissionController: Controller
    {
        private readonly IPermissionService _permissionService;
        private readonly IProjectPermissionService _projectPermissionService;

        public ProjectPermissionController(IPermissionService permissionService, IProjectPermissionService projectPermissionService)
        {
            _permissionService = permissionService;
            _projectPermissionService = projectPermissionService;
        }

        [HttpGet("{projectKey}/permissions")]
        public async Task<IActionResult> GetProjectPermissions([FromRoute] string projectKey, [FromQuery] ProjectPermissionCriteria criteria)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to view project permissions.");
            }

            criteria.ProjectKey = projectKey;
            return Ok(await _projectPermissionService.GetProjectPermissionsAsync(criteria));
        }

        [HttpPost("{projectKey}/permissions")]
        public async Task<IActionResult> AddProjectPermission([FromRoute] string projectKey, [FromBody] UpsertProjectPermissionParams ps)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to add project permissions.");
            }

            ps.ProjectKey = projectKey;
            return Ok(await _projectPermissionService.AddProjectPermissionAsync(ps));
        }
        
        [HttpPut("{projectKey}/permissions/{username}")]
        public async Task<IActionResult> UpdateProjectPermission([FromRoute] string projectKey, [FromRoute] string username, [FromBody] UpsertProjectPermissionParams ps)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to update this project permissions.");
            }
            
            ps.ProjectKey = projectKey;
            ps.Username = username;
            return Ok(await _projectPermissionService.UpdateProjectPermissionAsync(ps));
        }
        
        [HttpDelete("{projectKey}/permissions/{username}")]
        public async Task<IActionResult> DeleteProjectPermission([FromRoute] string projectKey, [FromRoute] string username)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to delete this project permissions.");
            }

            await _projectPermissionService.DeleteProjectPermissionAsync(projectKey, username);
                
            return Ok();
        }
    }
}