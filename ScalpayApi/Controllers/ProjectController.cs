using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/projects")]
    public class ProjectController : Controller
    {
        private readonly IProjectService _projectService;
        private readonly IItemService _itemService;

        public ProjectController(IProjectService projectService, IItemService itemService)
        {
            _projectService = projectService;
            _itemService = itemService;
        }

        [HttpGet]
        [Authorization(Privilege.ProjectViewAll)]
        public async Task<List<Project>> GetProjects()
        {
            return await _projectService.GetProjectsAsync();
        }

        [HttpGet("{projectKey}")]
        [Authorization(Privilege.ProjectView)]
        public async Task<Project> GetProject([FromRoute] string projectKey)
        {
            return await _projectService.GetProjectAsync(projectKey);
        }

        [HttpPut]
        [Authorization(Privilege.ProjectAdd)]
        public async Task<Project> AddProject([FromBody] AddProjectParams ps)
        {
            return await _projectService.AddProjectAsync(ps);
        }

        [HttpPost("{projectKey}")]
        [Authorization(Privilege.ProjectEdit)]
        public async Task<Project> UpdateProject([FromRoute] string projectKey, [FromBody] UpdateProjectParams ps)
        {
            ps.ProjectKey = projectKey;
            return await _projectService.UpdateProjectAsync(ps);
        }

        [HttpGet("{projectKey}/items")]
        [Authorization(Privilege.ItemViewAll)]
        public async Task<List<Item>> GetItems([FromRoute] string projectKey, [FromQuery] ItemType itemType)
        {
            return await _itemService.GetItemsAsync(new ItemCriteria()
            {
                ProjectKey = projectKey,
                ItemType = itemType
            });
        }

        [HttpDelete("{projectKey}")]
        [Authorization(Privilege.ProjectDelete)]
        public async Task DeleteProject([FromRoute] string projectKey)
        {
            await _projectService.DeleteProjectAsync(projectKey);
        }
    }
}