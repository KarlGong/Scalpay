﻿using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;
using Scalpay.Services.ItemService;
using Scalpay.Services.ProjectService;
using Scalpay.Services.UserService;

namespace Scalpay.Controllers
{
    [Route("api/projects")]
    public class ProjectItemController : Controller
    {
        private readonly User _user;
        private readonly IProjectService _projectService;
        private readonly IItemService _itemService;

        public ProjectItemController(IHttpContextAccessor accessor, IProjectService projectService, IItemService itemService, IUserService userService)
        {
            _user = userService.GetUserAsync(accessor.HttpContext.User.FindFirstValue("username")).Result;
            _projectService = projectService;
            _itemService = itemService;
        }

        [HttpGet()]
        public async Task<ListResults<Project>> GetProjects([FromQuery] ProjectCriteria criteria)
        {
            return await _projectService.GetProjectsAsync(criteria);
        }

        [HttpGet("{projectKey}")]
        public async Task<Project> GetProject([FromRoute] string projectKey)
        {
            return await _projectService.GetProjectAsync(projectKey);
        }

        [HttpPut()]
        public async Task<IActionResult> AddProject([FromBody] Project project)
        {
            if (!_user.Role.Equals(Role.Admin))
            {
                return Forbid("You have no permission to add project.");
            }

            return Ok(await _projectService.AddProjectAsync(project));
        }

        [HttpPost("{projectKey}")]
        public async Task<IActionResult> UpdateProject([FromRoute] string projectKey, [FromBody] Project project)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to update this project.");
            }

            return Ok(await _projectService.UpdateProjectAsync(projectKey, project));
        }

        [HttpGet("{projectKey}/items")]
        public async Task<IActionResult> GetItems([FromRoute] string projectKey, [FromQuery] ItemCriteria criteria)
        {
            if (!_user.Role.Equals(Role.Admin)
                && (await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.None))
            {
                return Forbid("You have no permission to view items of this project.");
            }

            criteria.ProjectKey = projectKey;
            return Ok(await _itemService.GetItemsAsync(criteria));
        }

        [HttpGet("{projectKey}/items/{itemKey}")]
        public async Task<IActionResult> GetItem([FromRoute] string projectKey, [FromRoute] string itemKey)
        {
            if (!_user.Role.Equals(Role.Admin)
                && (await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.None))
            {
                return Forbid("You have no permission to view item of this project.");
            }

            return Ok(await _itemService.GetItemAsync(itemKey));
        }

        [HttpPut("{projectKey}/items")]
        public async Task<IActionResult> AddItem([FromRoute] string projectKey, [FromBody] Item item)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to add item for this project.");
            }

            item.ProjectKey = projectKey;
            return Ok(await _itemService.AddItemAsync(item));
        }

        [HttpPost("{projectKey}/items/{itemKey}")]
        public async Task<IActionResult> UpdateItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] Item item)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to edit item for this project.");
            }

            item.ProjectKey = projectKey;
            return Ok(await _itemService.UpdateItemAsync(itemKey, item));
        }

        [HttpPost("{projectKey}/items/{itemKey}/eval")]
        public async Task<IActionResult> EvalItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            if (!_user.Role.Equals(Role.Admin)
                && (await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.None))
            {
                return Forbid("You have no permission to eval item of this project.");
            }

            var item = await _itemService.GetItemAsync(itemKey);
            return Ok(await _itemService.EvalItemAsync(item, parameters));
        }

        [HttpGet("{projectKey}/permissions")]
        public async Task<IActionResult> GetProjectPermissions([FromRoute] string projectKey)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to view permissions for this project.");
            }

            return Ok(await _projectService.GetProjectPermissionsAsync(new ProjectPermissionCriteria()
            {
                ProjectKey = projectKey,
                PageSize = 999999
            }));
        }

        [HttpGet("{projectKey}/permissions/{username}")]
        public async Task<IActionResult> GetProjectPermission([FromRoute] string projectKey, [FromRoute] string username)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin)
                && _user.Username != username)
            {
                return Forbid("You have no permission to view permission for this project.");
            }

            return Ok(await _projectService.GetProjectPermissionAsync(projectKey, username));
        }

        [HttpPut("{projectKey}/permissions")]
        public async Task<IActionResult> AddProjectPermissions([FromRoute] string projectKey, [FromBody] ProjectPermission permission)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to add permission for this project.");
            }

            permission.ProjectKey = projectKey;
            return Ok(await _projectService.AddProjectPermissionAsync(permission));
        }

        [HttpPost("{projectKey}/permissions/{username}")]
        public async Task<IActionResult> UpdateProjectPermission([FromRoute] string projectKey, [FromRoute] string username,
            [FromBody] ProjectPermission permission)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to edit permission for this project.");
            }

            permission.ProjectKey = projectKey;
            permission.Username = username;
            return Ok(await _projectService.UpdateProjectPermissionAsync(permission));
        }

        [HttpDelete("{projectKey}/permissions/{username}")]
        public async Task<IActionResult> DeleteProjectPermission([FromRoute] string projectKey, [FromRoute] string username)
        {
            if (!_user.Role.Equals(Role.Admin)
                && !(await _projectService.GetProjectPermissionAsync(projectKey, _user.Username)).Permission.Equals(Permission.Admin))
            {
                return Forbid("You have no permission to delete permission for this project.");
            }

            await _projectService.DeleteProjectPermissionAsync(projectKey, username);
            return Ok();
        }
    }
}