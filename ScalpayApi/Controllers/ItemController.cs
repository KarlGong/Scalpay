﻿using System.Collections.Generic;
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

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
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

        [HttpGet("{itemKey}")]
        public async Task<Result<Item>> GetItem([FromRoute] string itemKey)
        {
            return new Result<Item>()
            {
                Data = await _itemService.GetItemAsync(itemKey)
            };
        }

        [HttpPut]
        [Authorization(Privilege.ItemAdd)]
        public async Task<Result<Item>> AddItem([FromBody] AddItemParams ps)
        {
            return new Result<Item>()
            {
                Data = await _itemService.AddItemAsync(ps)
            };
        }

        [HttpPost("{itemKey}")]
        [Authorization(Privilege.ItemEdit)]
        public async Task<Result<Item>> UpdateItem([FromRoute] string itemKey, [FromBody] UpdateItemParams ps)
        {
            ps.ItemKey = itemKey;
            return new Result<Item>()
            {
                Data = await _itemService.UpdateItemAsync(ps)
            };
        }

        [HttpDelete("{itemKey}")]
        [Authorization(Privilege.ItemDelete)]
        public async Task<Result> DeleteItem([FromRoute] string itemKey)
        {
            await _itemService.DeleteItemAsync(itemKey);
            return new Result();
        }
    }
}