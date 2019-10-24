using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Services;
using Scalpay.Services.Parameters;
using Scalpay.Services.Parameters.Criterias;

namespace Scalpay.Controllers
{
    [Route("api/items")]
    public class ItemController : Controller
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<Result<List<Item>>> GetLatestItems([FromQuery] ItemCriteria criteria)
        {
            return new Result<List<Item>>()
            {
                Data = await _itemService.GetLatestItemsAsync(criteria),
                TotalCount = await _itemService.GetLatestItemsCountAsync(criteria)
            };
        }

        [HttpGet("{itemKey}")]
        public async Task<Result<Item>> GetLatestItem([FromRoute] string itemKey)
        {
            return new Result<Item>()
            {
                Data = await _itemService.GetItemAsync(itemKey, null)
            };
        }

        [HttpGet("{itemKey}/v{version}")]
        public async Task<Result<Item>> GetItem([FromRoute] string itemKey, [FromRoute] int version)
        {
            return new Result<Item>()
            {
                Data = await _itemService.GetItemAsync(itemKey, version)
            };
        }

        [HttpPut]
        [Authorization(Privilege.ItemManage)]
        public async Task<Result<Item>> AddItem([FromBody] AddItemParams ps)
        {
            return new Result<Item>()
            {
                Data = await _itemService.AddItemAsync(ps)
            };
        }

        [HttpPost("{itemKey}")]
        [Authorization(Privilege.ItemManage)]
        public async Task<Result<Item>> UpdateItem([FromRoute] string itemKey, [FromBody] UpdateItemParams ps)
        {
            ps.ItemKey = itemKey;
            return new Result<Item>()
            {
                Data = await _itemService.UpdateItemAsync(ps)
            };
        }
    }
}