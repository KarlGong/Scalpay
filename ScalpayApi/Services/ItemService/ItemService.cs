using System;
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

        Task<Item> UpdateItemAsync(Item item);

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
                
                var item = await _context.Items.AsNoTracking().Include(i => i.Rules).FirstOrDefaultAsync(i => i.ItemKey == itemKey);
                if (item == null)
                {
                    throw new NotFoundException($"The item {itemKey} cannot be found.");
                }

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

            item.Rules.ForEach(rule =>
            {
                rule.InsertTime = DateTime.UtcNow;
                rule.UpdateTime = DateTime.UtcNow;
            });
            item.InsertTime = DateTime.UtcNow;
            item.UpdateTime = DateTime.UtcNow;

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(Item item)
        {
            var oldItem = await _context.Items.Include(i => i.Rules).FirstOrDefaultAsync(i => i.ItemKey == item.ItemKey);

            if (oldItem == null)
            {
                throw new NotFoundException($"Item {item.ItemKey} cannot be found.");
            }

            _mapper.Map(item, oldItem);
            oldItem.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            _cache.Remove($"item-{item.ItemKey}");

            return oldItem;
        }

        public async Task<SData> EvalItemAsync(Item item, Dictionary<string, JToken> parameters)
        {
            var variables = new Dictionary<string, SData>();

            foreach (var pair in parameters ?? new Dictionary<string, JToken>())
            {
                var parameterInfo = item.ParameterInfos.SingleOrDefault(p => p.Name == pair.Key);

                if (parameterInfo == null)
                    continue; // data type not found, since parameter is not declared in parameter list.

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