using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    public class ItemODataController: ODataController
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;

        public ItemODataController(ScalpayDbContext context, IUserService userService, IProjectPermissionService permissionService)
        {
            _context = context;
            _permissionService = permissionService;
            _user = userService.GetCurrentUserAsync().Result;
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("projects/{projectId}/items")]
        public async Task<IActionResult> GetItems([FromRoute] string projectId)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission != Permission.None))
            {
                return Forbid("You have no permission to view items in this project.");
            }
            
            return Ok(_context.Items.Where(i => i.ProjectId == projectId));
        }
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("projects/{projectId}/items/{itemId}")]
        public async Task<IActionResult> GetItem([FromRoute] string projectId, [FromRoute] string itemId)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission != Permission.None))
            {
                return Forbid("You have no permission to view items in this project.");
            }
            return Ok(_context.Items.Where(i => i.Id == itemId && i.ProjectId == projectId));
        }
    }
    
    [Route("api/projects")]
    public class ItemController: Controller
    {
        private readonly ScalpayDbContext _context;
        private readonly User _user;
        private readonly IProjectPermissionService _permissionService;
        private readonly IItemService _itemService;
        private readonly IEvalService _evalService;

        public ItemController(ScalpayDbContext context, IUserService service, IProjectPermissionService permissionService, IItemService itemService, IEvalService evalService)
        {
            _context = context;
            _user = service.GetCurrentUserAsync().Result;
            _permissionService = permissionService;
            _itemService = itemService;
            _evalService = evalService;
        }
        
        [HttpPost("{projectId}/items")]
        public async Task<IActionResult> AddItem([FromRoute] string projectId, [FromBody] UpsertItemParams ps)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission == Permission.Admin))
            {
                return Forbid("You have no permission to add item.");
            }

            ps.ProjectId = projectId;
            return Ok(await _itemService.AddItemAsync(ps));
        }

        [HttpPut("{projectId}/items/{itemId}")]
        public async Task<IActionResult> UpdateItem([FromRoute] string projectId, [FromRoute] string itemId, [FromBody] UpsertItemParams ps)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission == Permission.Admin))
            {
                return Forbid("You have no permission to edit this item.");
            }

            ps.ProjectId = projectId;
            ps.Id = itemId;
            return Ok(await _itemService.UpdateItemAsync(ps));
        }

        [HttpPost("{projectId}/items/{itemId}/eval")]
        public async Task<IActionResult> EvalItem([FromRoute] string projectId, [FromRoute] string itemId, [FromBody] Dictionary<string, JToken> parameters)
        {
            if (!(_user.Role.Equals(Role.Admin) || (await _permissionService.GetCachedProjectPermissionAsync(projectId, _user.Id)).Permission != Permission.None))
            {
                return Forbid("You have no permission to eval this item.");
            }

            var item = await _itemService.GetItemAsync(itemId);
            return Ok(await _evalService.EvalItemAsync(item, parameters));
        }
    }
}