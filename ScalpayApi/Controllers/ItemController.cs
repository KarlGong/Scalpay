using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi;

namespace ScalpayApi.Controllers
{
    [Route("api/items")]
    public class ItemController : Controller
    {
        private readonly IItemService _itemService;
        private readonly IItemConfigService _itemConfigservice;
        private readonly IItemWordService _itemWordService;

        public ItemController(IItemService itemService, IItemConfigService itemConfigService, IItemWordService itemWordService)
        {
            _itemService = itemService;
            _itemConfigservice = itemConfigService;
            _itemWordService = itemWordService;
        }
        
        [HttpGet]
        public async Task<List<Item>> GetItems([FromQuery] ItemCriteria criteria)
        {
            return await _itemService.GetItemsAsync(criteria);
        }

        [HttpGet("config/{itemKey}")]
        public async Task<Item> GetItem([FromRoute] string itemKey)
        {
            return await _itemConfigservice.GetItemConfigAsync(itemKey);
        }

        [HttpPut("config")]
        [Authorization(Privilege.ItemAdd)]
        public async Task<Item> AddItem([FromBody] AddItemConfigParams ps)
        {
            return await _itemConfigservice.AddItemConfigAsync(ps);
        }

        [HttpPost("config/{itemKey}")]
        [Authorization(Privilege.ItemEdit)]
        public async Task<Item> UpdateItem([FromRoute] string itemKey, [FromBody] UpdateItemConfigParams ps)
        {
            ps.ItemKey = itemKey;
            return await _itemConfigservice.UpdateItemConfigAsync(ps);
        }

        [HttpDelete("config/{itemKey}")]
        [Authorization(Privilege.ItemDelete)]
        public async Task DeleteItem([FromRoute] string itemKey)
        {
            await _itemConfigservice.DeleteItemConfigAsync(itemKey);
        }
    }
}