using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Scalpay.Models;
using Scalpay.Models.SExpressions;
using Scalpay.Services;
using Scalpay.Services.ItemService;
using Scalpay.Services.ProjectService;

namespace Scalpay.Controllers
{
    [Route("api/projects")]
    public class ProjectItemController : Controller
    {
        private readonly IProjectService _projectService;
        private readonly IItemService _itemService;

        public ProjectItemController(IProjectService projectService, IItemService itemService)
        {
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
        public async Task<Project> AddProject([FromBody] Project project)
        {
            return await _projectService.AddProjectAsync(project);
        }

        [HttpPost("{projectKey}")]
        public async Task<Project> UpdateProject([FromRoute] string projectKey, [FromBody] Project project)
        {
            project.ProjectKey = projectKey;
            return await _projectService.UpdateProjectAsync(project);
        }

        [HttpGet("{projectKey}/items")]
        public async Task<ListResults<Item>> GetItems([FromRoute] string projectKey, [FromQuery] ItemCriteria criteria)
        {
            criteria.ProjectKey = projectKey;
            return await _itemService.GetItemsAsync(criteria);
        }

        [HttpGet("{projectKey}/items/{itemKey}")]
        public async Task<Item> GetItem([FromRoute] string projectKey, [FromRoute] string itemKey)
        {
            return await _itemService.GetItemAsync(itemKey);
        }

        [HttpPut("{projectKey}/items")]
        public async Task<Item> AddItem([FromRoute] string projectKey, [FromBody] Item item)
        {
            item.ProjectKey = projectKey;
            return await _itemService.AddItemAsync(item);
        }

        [HttpPost("{projectKey}/items/{itemKey}")]
        public async Task<Item> UpdateItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] Item item)
        {
            item.ProjectKey = projectKey;
            item.ItemKey = itemKey;
            return await _itemService.UpdateItemAsync(item);
        }

        [HttpPost("{projectKey}/items/{itemKey}/eval")]
        public async Task<SData> EvalItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            var item = await _itemService.GetItemAsync(itemKey);
            return await _itemService.EvalItemAsync(item, parameters);
        }
    }
}