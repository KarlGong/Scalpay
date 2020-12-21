using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Models.SExpressions;
using Scalpay.Services.Query;

namespace Scalpay.Services
{
    public class ItemCriteria : Criteria<Item>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }
        
        public string Keyword { get; set; }

        public override Expression<Func<Item, bool>> ToWherePredicate()
        {
            return i => (ItemKey == null || ItemKey == i.ItemKey)
                        && (ProjectKey == null || ProjectKey == i.ProjectKey)
                        && (Keyword == null
                            || i.ItemKey.Contains(Keyword)
                            || i.Description.Contains(Keyword));
        }
    }
    
    public class UpsertItemParams
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }
        
        public string Description { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }

        public SExpression DefaultResult { get; set; }

        public List<Rule> Rules { get; set; }
    }


    public interface IItemService
    {
        Task<Item> GetItemAsync(string itemKey);

        Task<Item> GetCachedItemAsync(string itemKey);

        Task<QueryResults<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<Item> AddItemAsync(UpsertItemParams ps);

        Task<Item> UpdateItemAsync(UpsertItemParams ps);

        Task DeleteItemAsync(string itemKey);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;
        private readonly IEvalService _expService;

        public ItemService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper, IEvalService expService)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
            _expService = expService;
        }

        public async Task<Item> GetItemAsync(string itemKey)
        {
            var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(i => i.ItemKey == itemKey);
            if (item == null)
            {
                throw new NotFoundException($"The item {itemKey} cannot be found.");
            }

            return item;
        }

        public async Task<Item> GetCachedItemAsync(string itemKey)
        {
            return await _cache.GetOrCreateAsync($"item-{itemKey}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetItemAsync(itemKey);
            });
        }

        public async Task<QueryResults<Item>> GetItemsAsync(ItemCriteria criteria)
        {
            return new QueryResults<Item>()
            {
                Value = await _context.Items.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Items.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Item> AddItemAsync(UpsertItemParams ps)
        {
            if (await _context.Items.AsNoTracking().AnyAsync(i => i.ItemKey == ps.ItemKey))
            {
                throw new ConflictException($"Item with key {ps.ItemKey} is already existing.");
            }
            
            // verification
            if (!ps.ItemKey.Split(".")[0].Equals(ps.ProjectKey, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidParamsException("The item key should be started with it's project key.");
            }

            var item = _mapper.Map<Item>(ps);

            await _context.Items.AddAsync(item);
            
            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpsertItemParams ps)
        {
            _cache.Remove($"item-{ps.ItemKey}");
            
            var oldItem = await _context.Items.FirstOrDefaultAsync(i => i.ItemKey == ps.ItemKey);
            if (oldItem == null)
            {
                throw new NotFoundException($"Item {ps.ItemKey} cannot be found.");
            }
            
            // verification
            if (!ps.ItemKey.Split(".")[0].Equals(ps.ProjectKey, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidParamsException("The item key should be started with it's project key.");
            }

            _mapper.Map(ps, oldItem);

            await _context.SaveChangesAsync();

            return oldItem;
        }

        public async Task DeleteItemAsync(string itemKey)
        {
            _cache.Remove($"item-{itemKey}");
            
            var oldItem = await _context.Items.FirstOrDefaultAsync(i => i.ItemKey == itemKey);
            if (oldItem == null)
            {
                throw new NotFoundException($"Item {itemKey} cannot be found.");
            }
            
            _context.Items.Remove(oldItem);
            await _context.SaveChangesAsync();
        }
    }
}