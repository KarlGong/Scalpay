using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    [Route("api/projects")]
    public class ProjectController : Controller
    {
        private readonly IPermissionService _permissionService;
        private readonly IProjectService _projectService;

        public ProjectController(IPermissionService permissionService, IProjectService projectService)
        {
            _permissionService = permissionService;
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects([FromQuery] ProjectCriteria criteria)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Read))
            {
                return StatusCode(403, "You have no permission to view projects.");
            }

            return Ok(await _projectService.GetProjectsAsync(criteria));
        }

        [HttpGet("{projectKey}")]
        public async Task<IActionResult> GetProject([FromRoute] string projectKey)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Read))
            {
                return StatusCode(403, "You have no permission to view this project.");
            }

            return Ok(await _projectService.GetProjectAsync(projectKey));
        }

        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] UpsertProjectParams ps)
        {
            if (!await _permissionService.HasGlobalPermissionAsync(Permission.Admin))
            {
                return StatusCode(403, "You have no permission to add project.");
            }
            
            return Ok(await _projectService.AddProjectAsync(ps));
        }

        [HttpPut("{projectKey}")]
        public async Task<IActionResult> UpdateProject([FromRoute] string projectKey, [FromBody] UpsertProjectParams ps)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to update this project.");
            }

            ps.ProjectKey = projectKey;
            return Ok(await _projectService.UpdateProjectAsync(ps));
        }

        [HttpDelete("{projectKey}")]
        public async Task<IActionResult> DeleteProject([FromRoute] string projectKey)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to delete this project.");
            }

            await _projectService.DeleteProjectAsync(projectKey);
            
            return Ok();
        }
    }
}