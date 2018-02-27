using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
    public class ItemCriteria : Criteria<Item>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }

        public ItemType? ItemType { get; set; }

        public string SearchText { get; set; }

        public override Expression<Func<Item, bool>> ToWherePredicate()
        {
            return i =>
                (ItemKey == null || ItemKey == i.ItemKey)
                && (ProjectKey == null || ProjectKey == i.Project.ProjectKey)
                && (ItemType == null || ItemType == i.Type)
                && (SearchText == null
                    || i.ItemKey.Contains(SearchText)
                    || i.Name.Contains(SearchText)
                    || i.Description.Contains(SearchText));
        }
    }

    public class AddItemParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ItemType Type { get; set; }
        
        public ConfigMode? ConfigMode { get; set; }
        
        public string RulesString { get; set; }
    }

    public class UpdateItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public ConfigMode? ConfigMode { get; set; }
        
        public string RulesString { get; set; }
    }

    public interface IItemService
    {
        Task<Item> GetItemAsync(ItemCriteria criteria);

        Task<Item> GetItemAsync(string itemKey);

        Task<List<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task DeleteItemAsync(string itemKey);

        Task<SData> EvalItem(Item item, Dictionary<string, SData> parameters);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        private readonly IExpressionService _expService;

        public ItemService(ScalpayDbContext context, IMapper mapper, IExpressionService expService)
        {
            _context = context;
            _mapper = mapper;
            _expService = expService;
        }

        public async Task<Item> GetItemAsync(ItemCriteria criteria)
        {
            return await _context.Items.Include(i => i.Project).SingleOrDefaultAsync(criteria.ToWherePredicate());
        }

        public async Task<Item> GetItemAsync(string itemKey)
        {
            return await GetItemAsync(new ItemCriteria()
            {
                ItemKey = itemKey
            });
        }

        public async Task<List<Item>> GetItemsAsync(ItemCriteria criteria)
        {
            return await _context.Items.Include(i => i.Project).Where(criteria.ToWherePredicate()).ToListAsync();
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var item = _mapper.Map<Item>(ps);

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemParams ps)
        {
            var previousItem = await GetItemAsync(ps.ItemKey);

            _mapper.Map(ps, previousItem);

            await _context.SaveChangesAsync();

            return previousItem;
        }

        public async Task DeleteItemAsync(string itemKey)
        {
            _context.Items.Remove(await GetItemAsync(itemKey));

            await _context.SaveChangesAsync();
        }

        public async Task<SData> EvalItem(Item item, Dictionary<string, SData> parameters)
        {
            foreach (var rule in item.Rules.Where(r => r.Condition != null).OrderBy(r => r.Order))
            {
                if (((SBool) await _expService.EvalExpressionAsync(rule.Condition, parameters)).Inner)
                {
                    return await _expService.EvalExpressionAsync(rule.Result, parameters);
                }
            }

            var defaultRule = item.Rules.Single(r => r.Condition == null);

            return await _expService.EvalExpressionAsync(defaultRule.Result, parameters);
        }
    }
}