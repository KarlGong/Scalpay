﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;
using Scalpay.Services.Parameters;
using Scalpay.Services.Parameters.Criterias;

namespace Scalpay.Controllers
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
        public async Task<Result<List<Project>>> GetLatestProjects([FromQuery] ProjectCriteria criteria)
        {
            return new Result<List<Project>>()
            {
                Data = await _service.GetLatestProjectsAsync(criteria),
                TotalCount = await _service.GetLatestProjectsCountAsync(criteria)
            };
        }
        
        [HttpGet("{projectKey}")]
        public async Task<Result<Project>> GetLatestProject([FromRoute] string projectKey)
        {
            return new Result<Project>()
            {
                Data = await _service.GetProjectAsync(projectKey, null)
            };
        }

        [HttpGet("{projectKey}/v{version}")]
        public async Task<Result<Project>> GetProject([FromRoute] string projectKey, [FromRoute] int version)
        {
            return new Result<Project>()
            {
                Data = await _service.GetProjectAsync(projectKey, version)
            };
        }

        [HttpPut]
        [Authorization(Privilege.ProjectManage)]
        public async Task<Result<Project>> AddProject([FromBody] AddProjectParams ps)
        {
            return new Result<Project>()
            {
                Data = await _service.AddProjectAsync(ps)
            };
        }

        [HttpPost("{projectKey}")]
        [Authorization(Privilege.ProjectManage)]
        public async Task<Result<Project>> UpdateProject([FromRoute] string projectKey, [FromBody] UpdateProjectParams ps)
        {
            ps.ProjectKey = projectKey;
            return new Result<Project>()
            {
                Data = await _service.UpdateProjectAsync(ps)
            };
        }
    }
}