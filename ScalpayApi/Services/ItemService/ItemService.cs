﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Models.SExpressions;
using Scalpay.Services.ExpressionService;

namespace Scalpay.Services.ItemService
{
    public interface IItemService
    {
        Task<Item> GetItemAsync(string itemKey);

        Task<ListResults<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<Item> AddItemAsync(Item item);

        Task<Item> UpdateItemAsync(string itemKey, Item item);

        Task<SData> EvalItemAsync(Item item, Dictionary<string, JToken> parameters);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;

        public ItemService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper, IExpressionService expService)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
            _expService = expService;
        }

        public async Task<Item> GetItemAsync(string itemKey)
        {
            return await _cache.GetOrCreateAsync($"item-{itemKey}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                
                var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(i => i.ItemKey == itemKey);
                if (item == null)
                {
                    throw new NotFoundException($"The item {itemKey} cannot be found.");
                }

                item.Rules = await _context.Rules.AsNoTracking().Where(r => r.ItemKey == itemKey).ToListAsync();
                return item;
            });
        }

        public async Task<ListResults<Item>> GetItemsAsync(ItemCriteria criteria)
        {
            return new ListResults<Item>()
            {
                Data = await _context.Items.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Items.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Item> AddItemAsync(Item item)
        {
            if (await _context.Items.AsNoTracking().AnyAsync(i => i.ItemKey == item.ItemKey))
            {
                throw new ConflictException($"Item with key {item.ItemKey} is already existing.");
            }

            item.InsertTime = DateTime.UtcNow;
            item.UpdateTime = DateTime.UtcNow;
            await _context.Items.AddAsync(item);
            
            var order = 0;
            item.Rules.ForEach(rule =>
            {
                rule.ItemKey = item.ItemKey;
                rule.Order = order++;
                rule.InsertTime = DateTime.UtcNow;
                rule.UpdateTime = DateTime.UtcNow;
            });
            await _context.Rules.AddRangeAsync(item.Rules);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(string itemKey, Item item)
        {
            _cache.Remove($"item-{itemKey}");
            
            var oldItem = await _context.Items.FirstOrDefaultAsync(i => i.ItemKey == itemKey);

            if (oldItem == null)
            {
                throw new NotFoundException($"Item {itemKey} cannot be found.");
            }
            
            if (itemKey != item.ItemKey && await _context.Items.AsNoTracking().AnyAsync(i => i.ItemKey == item.ItemKey))
            {
                throw new ConflictException($"Item with key {item.ItemKey} is already existing.");
            }

            _context.Entry(oldItem).State = EntityState.Modified; // fix cannot track ParametersInfo's change
            _mapper.Map(item, oldItem);
            oldItem.UpdateTime = DateTime.UtcNow;
            
            _context.Rules.RemoveRange(_context.Rules.AsNoTracking().Where(r => r.ItemKey == itemKey));
            var order = 0;
            item.Rules.ForEach(rule =>
            {
                rule.Id = 0;
                rule.ItemKey = item.ItemKey;
                rule.Order = order++;
                rule.InsertTime = DateTime.UtcNow;
                rule.UpdateTime = DateTime.UtcNow;
            });
            await _context.Rules.AddRangeAsync(item.Rules);

            await _context.SaveChangesAsync();

            return oldItem;
        }

        public async Task<SData> EvalItemAsync(Item item, Dictionary<string, JToken> parameters)
        {
            var variables = new Dictionary<string, SData>();

            if (parameters != null)
            {
                foreach (var pair in parameters)
                {
                    var parameterInfo = item.ParameterInfos?.SingleOrDefault(p => p.Name == pair.Key);

                    if (parameterInfo == null)
                        continue; // data type not found, since parameter is not declared in parameter list.

                    variables.Add(pair.Key, await _expService.ConvertToSDataAsync(pair.Value, parameterInfo.DataType));
                }
            }

            if (item.Rules != null)
            {
                foreach (var rule in item.Rules.OrderBy(r => r.Order))
                {
                    if (((SBool) await _expService.EvalExpressionAsync(rule.Condition, variables)).Inner)
                    {
                        return await _expService.EvalExpressionAsync(rule.Result, variables);
                    }
                }
            }

            return await _expService.EvalExpressionAsync(item.DefaultResult, variables);
        }
    }
}