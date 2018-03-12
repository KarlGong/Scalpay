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
        public async Task<Result<List<Project>>> GetProjects([FromQuery] ProjectCriteria criteria)
        {
            return new Result<List<Project>>()
            {
                Data = await _service.GetProjectsAsync(criteria),
                TotalCount = await _service.GetProjectsCountAsync(criteria)
            };
        }

        [HttpGet("{projectKey}")]
        public async Task<Result<Project>> GetProject([FromRoute] string projectKey)
        {
            return new Result<Project>()
            {
                Data = await _service.GetProjectAsync(projectKey)
            };
        }

        [HttpPut]
        [Authorization(Privilege.ProjectAdd)]
        public async Task<Result<Project>> AddProject([FromBody] AddProjectParams ps)
        {
            return new Result<Project>()
            {
                Data = await _service.AddProjectAsync(ps)
            };
        }

        [HttpPost("{projectKey}")]
        [Authorization(Privilege.ProjectEdit)]
        public async Task<Result<Project>> UpdateProject([FromRoute] string projectKey, [FromBody] UpdateProjectParams ps)
        {
            ps.ProjectKey = projectKey;
            return new Result<Project>()
            {
                Data = await _service.UpdateProjectAsync(ps)
            };
        }

        [HttpDelete("{projectKey}")]
        [Authorization(Privilege.ProjectDelete)]
        public async Task<Result> DeleteProject([FromRoute] string projectKey)
        {
            await _service.DeleteProjectAsync(projectKey);
            return new Result();
        }
    }
}