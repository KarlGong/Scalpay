using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/items")]
    public class ItemController: Controller
    {
        private readonly IItemService _service;

        public ItemController(IItemService service)
        {
            _service = service;
        }

        [HttpGet("{itemKey}")]
        public async Task<Item> GetItem([FromRoute] string itemKey)
        {
            return await _service.GetItemAsync(itemKey);
        }

        [HttpPut]
        public async Task<Item> AddItem(AddItemParams ps)
        {
            return await _service.AddItemAsync(ps);
        }

        [HttpPost("{itemKey}")]
        public async Task<Item> UpdateItem([FromRoute] string itemKey, UpdateItemParams ps)
        {
            ps.ItemKey = itemKey;
            return await _service.UpdateItemAsync(ps);
        }

        [HttpDelete("{itemKey}")]
        public async Task DeleteItem([FromRoute] string itemKey)
        {
            await _service.DeleteItemAsync(itemKey);
        }
    }
}