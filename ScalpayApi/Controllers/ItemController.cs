using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("{id}")]
        public async Task<Item> GetItem([FromRoute] int id)
        {
            return await _service.GetAsync(id);
        }

        [HttpPut]
        public async Task<Item> AddItem(AddItemParams ps)
        {
            return await _service.AddItemAsync(ps);
        }

        [HttpPost("{id}")]
        public async Task<Item> UpdateItem([FromRoute] int id, UpdateItemParams ps)
        {
            ps.Id = id;
            return await _service.UpdateItemAsync(ps);
        }

        [HttpDelete("{id}")]
        public async Task DeleteItem([FromRoute] int id)
        {
            await _service.DeleteAsync(id);
        }

        [HttpGet]
        public async Task<List<Item>> GetItems([FromQuery] int projectId, [FromQuery] int? parentFolderId)
        {
            return await _service.GetItems(projectId, parentFolderId);
        }
    }
}