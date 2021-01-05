using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Scalpay.Enums;
using Scalpay.Services;

namespace Scalpay.Controllers
{
    [Route("api/projects")]
    public class ItemController: Controller
    {
        private readonly IPermissionService _permissionService;
        private readonly IItemService _itemService;
        private readonly IEvalService _evalService;

        public ItemController(IPermissionService permissionService, IItemService itemService, IEvalService evalService)
        {
            _permissionService = permissionService;
            _itemService = itemService;
            _evalService = evalService;
        }
        
        [HttpGet("{projectKey}/items")]
        public async Task<IActionResult> GetItems([FromRoute] string projectKey, [FromQuery] ItemCriteria criteria)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Read))
            {
                return StatusCode(403, "You have no permission to view items.");
            }

            criteria.ProjectKey = projectKey;
            return Ok(await _itemService.GetItemsAsync(criteria));
        }

        [HttpGet("{projectKey}/items/{itemKey}")]
        public async Task<IActionResult> GetItem([FromRoute] string projectKey, [FromRoute] string itemKey)
        {
            if (!itemKey.Split(".")[0].Equals(projectKey, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("The item id should be started with it's project id.");
            }
            
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Read))
            {
                return StatusCode(403, "You have no permission to view this item.");
            }

            return Ok(await _itemService.GetItemAsync(itemKey));
        }
        
        [HttpPost("{projectKey}/items")]
        public async Task<IActionResult> AddItem([FromRoute] string projectKey, [FromBody] UpsertItemParams ps)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to add item.");
            }

            ps.ProjectKey = projectKey;
            return Ok(await _itemService.AddItemAsync(ps));
        }

        [HttpPut("{projectKey}/items/{itemKey}")]
        public async Task<IActionResult> UpdateItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] UpsertItemParams ps)
        {
            if (!itemKey.Split(".")[0].Equals(projectKey, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("The item id should be started with it's project id.");
            }
            
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to edit this item.");
            }

            ps.ProjectKey = projectKey;
            ps.ItemKey = itemKey;
            return Ok(await _itemService.UpdateItemAsync(ps));
        }

        [HttpDelete("{projectKey}/items/{itemKey}")]
        public async Task<IActionResult> DeleteItem([FromRoute] string projectKey, [FromRoute] string itemKey)
        {
            if (!itemKey.Split(".")[0].Equals(projectKey, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("The item id should be started with it's project id.");
            }
            
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Admin))
            {
                return StatusCode(403, "You have no permission to delete this item.");
            }

            await _itemService.DeleteItemAsync(itemKey);

            return Ok();
        }

        [HttpPost("{projectKey}/items/{itemKey}/eval")]
        public async Task<IActionResult> EvalItem([FromRoute] string projectKey, [FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            if (!itemKey.Split(".")[0].Equals(projectKey, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("The item id should be started with it's project id.");
            }
            
            if (!await _permissionService.HasProjectPermissionAsync(projectKey, Permission.Read))
            {
                return StatusCode(403, "You have no permission to eval this item.");
            }

            var item = await _itemService.GetCachedItemAsync(itemKey);
            return Ok(await _evalService.EvalItemAsync(item, parameters));
        }
    }
}