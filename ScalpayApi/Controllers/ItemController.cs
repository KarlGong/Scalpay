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
        private readonly IItemService _service;

        public ItemController(IItemService service)
        {
            _service = service;
        }

        [HttpGet("{itemKey}")]
        [Authorization(Privilege.ItemView)]
        public async Task<Item> GetItem([FromRoute] string itemKey)
        {
            return await _service.GetItemAsync(itemKey);
        }

        [HttpPut]
        [Authorization(Privilege.ItemAdd)]
        public async Task<Item> AddItem([FromBody] AddItemParams ps)
        {
            return await _service.AddItemAsync(ps);
        }

        [HttpPost("{itemKey}")]
        [Authorization(Privilege.ItemEdit)]
        public async Task<Item> UpdateItem([FromRoute] string itemKey, UpdateItemParams ps)
        {
            ps.ItemKey = itemKey;
            return await _service.UpdateItemAsync(ps);
        }

        [HttpDelete("{itemKey}")]
        [Authorization(Privilege.ItemDelete)]
        public async Task DeleteItem([FromRoute] string itemKey)
        {
            await _service.DeleteItemAsync(itemKey);
        }
    }
}