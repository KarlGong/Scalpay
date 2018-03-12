using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Controllers
{
    [Route("api/items")]
    public class ItemController : Controller
    {
        private readonly IItemService _itemService;
        private readonly IConfigItemService _configItemservice;
        private readonly IWordItemService _wordItemService;

        public ItemController(IItemService itemService, IConfigItemService configItemService,
            IWordItemService wordItemService)
        {
            _itemService = itemService;
            _configItemservice = configItemService;
            _wordItemService = wordItemService;
        }

        [HttpGet]
        public async Task<Result<List<Item>>> GetItems([FromQuery] ItemCriteria criteria)
        {
            return new Result<List<Item>>()
            {
                Data = await _itemService.GetItemsAsync(criteria),
                TotalCount = await _itemService.GetItemsCountAsync(criteria)
            };
        }

        [HttpGet("config/{itemKey}")]
        public async Task<Result<Item>> GetConfigItem([FromRoute] string itemKey)
        {
            return new Result<Item>()
            {
                Data = await _configItemservice.GetConfigItemAsync(itemKey)
            };
        }

        [HttpPut("config")]
        [Authorization(Privilege.ItemAdd)]
        public async Task<Result<Item>> AddConfigItem([FromBody] AddConfigItemParams ps)
        {
            return new Result<Item>()
            {
                Data = await _configItemservice.AddConfigItemAsync(ps)
            };
        }

        [HttpPost("config/{itemKey}")]
        [Authorization(Privilege.ItemEdit)]
        public async Task<Result<Item>> UpdateConfigItem([FromRoute] string itemKey, [FromBody] UpdateConfigItemParams ps)
        {
            ps.ItemKey = itemKey;
            return new Result<Item>()
            {
                Data = await _configItemservice.UpdateConfigItemAsync(ps)
            };
        }

        [HttpDelete("config/{itemKey}")]
        [Authorization(Privilege.ItemDelete)]
        public async Task<Result> DeleteConfigItem([FromRoute] string itemKey)
        {
            await _configItemservice.DeleteConfigItemAsync(itemKey);
            return new Result();
        }

        [HttpGet("word/{itemKey}")]
        public async Task<Result<Item>> GetWordItem([FromRoute] string itemKey)
        {
            return new Result<Item>()
            {
                Data = await _wordItemService.GetWordItemAsync(itemKey)
            };
        }

        [HttpPut("word")]
        [Authorization(Privilege.ItemAdd)]
        public async Task<Result<Item>> AddWordItem([FromBody] AddWordItemParams ps)
        {
            return new Result<Item>()
            {
                Data = await _wordItemService.AddWordItemAsync(ps)
            };
        }

        [HttpPost("word/{itemKey}")]
        [Authorization(Privilege.ItemEdit)]
        public async Task<Result<Item>> UpdateWordItem([FromRoute] string itemKey, [FromBody] UpdateWordItemParams ps)
        {
            ps.ItemKey = itemKey;
            return new Result<Item>()
            {
                Data = await _wordItemService.UpdateWordItemAsync(ps)
            };
        }

        [HttpDelete("word/{itemKey}")]
        [Authorization(Privilege.ItemDelete)]
        public async Task<Result> DeleteWordItem([FromRoute] string itemKey)
        {
            await _wordItemService.DeleteWordItemAsync(itemKey);
            return new Result();
        }
    }
}