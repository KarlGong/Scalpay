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
        private readonly IProjectService _service;

        public ProjectController(IProjectService service)
        {
            _service = service;
        }

        [HttpGet("{projectKey}")]
        public async Task<Project> GetProject([FromRoute] string projectKey)
        {
            return await _service.GetProjectAsync(projectKey);
        }

        [HttpPut]
        public async Task<Project> AddProject([FromBody] AddProjectParams ps)
        {
            return await _service.AddProjectAsync(ps);
        }

        [HttpPost("{projectKey}")]
        public async Task<Project> UpdateProject([FromRoute] string projectKey, [FromBody] UpdateProjectParams ps)
        {
            ps.ProjectKey = projectKey;
            return await _service.UpdateProjectAsync(ps);
        }

        [HttpGet("{projectKey}/items")]
        public async Task<List<Item>> GetItems([FromRoute] string projectKey, [FromQuery] ItemType itemType)
        {
            return await _service.GetItems(projectKey, itemType);
        }
    }
}