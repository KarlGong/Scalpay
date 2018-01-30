using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<List<Project>> GetAllProjects()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Project> GetProject([FromRoute] int id)
        {
            return await _service.GetAsync(id);
        }

        [HttpPut]
        public async Task<Project> AddProject([FromBody] AddProjectParams ps)
        {
            return await _service.AddAsync(ps);
        }

        [HttpPost("{id}")]
        public async Task<Project> UpdateProject([FromRoute] int id, [FromBody] UpdateProjectParams ps)
        {
            ps.Id = id;
            return await _service.UpdateAsync(ps);
        }
    }
}