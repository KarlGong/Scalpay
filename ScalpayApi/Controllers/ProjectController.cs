using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Controllers
{
    [Route("api/projects")]
    public class ProjectController : Controller
    {
        private readonly IProjectService _service;

        public ProjectController(IProjectService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<Project>> GetProjects([FromQuery] ProjectCriteria criteria)
        {
            return await _service.GetProjectsAsync(criteria);
        }

        [HttpGet("{projectKey}")]
        public async Task<Project> GetProject([FromRoute] string projectKey)
        {
            return await _service.GetProjectAsync(projectKey);
        }

        [HttpPut]
        [Authorization(Privilege.ProjectAdd)]
        public async Task<Project> AddProject([FromBody] AddProjectParams ps)
        {
            return await _service.AddProjectAsync(ps);
        }

        [HttpPost("{projectKey}")]
        [Authorization(Privilege.ProjectEdit)]
        public async Task<Project> UpdateProject([FromRoute] string projectKey, [FromBody] UpdateProjectParams ps)
        {
            ps.ProjectKey = projectKey;
            return await _service.UpdateProjectAsync(ps);
        }

        [HttpDelete("{projectKey}")]
        [Authorization(Privilege.ProjectDelete)]
        public async Task DeleteProject([FromRoute] string projectKey)
        {
            await _service.DeleteProjectAsync(projectKey);
        }
    }
}