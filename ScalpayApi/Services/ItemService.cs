using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;
using ScalpayApi.Data;
using ScalpayApi.Models;
using ScalpayApi.Services.Exceptions;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
    public interface IItemService
    {
        Task<List<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<int> GetItemsCountAsync(ItemCriteria criteria);
        
        Task<Item> GetItemAsync(string itemKey);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task DeleteItemAsync(string itemKey);

        Task<SData> EvalItem(string itemKey, Dictionary<string, JToken> parameters);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;

        public ItemService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper,
            IExpressionService expService)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
            _expService = expService;
        }
        
        public async Task<List<Item>> GetItemsAsync(ItemCriteria criteria)
        {
            return await _context.Items.AsNoTracking().Include(i => i.Project).OrderBy(i => i.ItemKey).WithCriteria(criteria)
                .ToListAsync();
        }

        public async Task<int> GetItemsCountAsync(ItemCriteria criteria)
        {
            return await _context.Items.AsNoTracking().CountAsync(criteria);
        }

        public async Task<Item> GetItemAsync(string itemKey)
        {
            return await _cache.GetOrCreateAsync(itemKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);

                var item = await _context.Items.AsNoTracking().Include(i => i.Project).Include(i => i.Rules)
                    .SingleOrDefaultAsync(i => i.ItemKey == itemKey);
                if (item == null)
                {
                    throw new ScalpayException(StatusCode.ItemNotFound,
                        $"Item with item key {itemKey} is not found.");
                }

                item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

                return item;
            });
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var oldItem = await _context.Items.AsNoTracking().SingleOrDefaultAsync(i => i.ItemKey == ps.ItemKey);

            if (oldItem != null)
            {
                throw new ScalpayException(StatusCode.ItemExisted,
                    $"Item with item key {ps.ItemKey} is already existed.");
            }

            var item = _mapper.Map<Item>(ps);

            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemParams ps)
        {
            var item = await GetItemAsync(ps.ItemKey);

            _context.Items.Attach(item);

            _mapper.Map(ps, item);

            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);

            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));

            return item;
        }

        public async Task DeleteItemAsync(string itemKey)
        {
            _context.Items.Remove(await GetItemAsync(itemKey));

            await _context.SaveChangesAsync();

            _cache.Remove(itemKey);
        }

        public async Task<SData> EvalItem(string itemKey, Dictionary<string, JToken> parameters)
        {
            var item = await GetItemAsync(itemKey);

            var variables = new Dictionary<string, SData>();

            foreach (var pair in parameters ?? new Dictionary<string, JToken>())
            {
                var parameterInfo = item.ParameterInfos.SingleOrDefault(p => p.Name == pair.Key);

                if (parameterInfo == null)
                    continue; // data type not found, since paramter is not decalred in parameter list.

                variables.Add(pair.Key, await _expService.ConvertToSDataAsync(pair.Value, parameterInfo.DataType));
            }

            foreach (var rule in item.Rules.OrderBy(r => r.Order))
            {
                if (((SBool) await _expService.EvalExpressionAsync(rule.Condition, variables)).Inner)
                {
                    return await _expService.EvalExpressionAsync(rule.Result, variables);
                }
            }

            return await _expService.EvalExpressionAsync(item.DefaultResult, variables);
        }
    }
}