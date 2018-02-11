using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class ItemCriteria : Criteria<Item>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }

        public ItemType? ItemType { get; set; }

        public override Expression<Func<Item, bool>> ToWherePredicate()
        {
            return i =>
                (ItemKey == null || ItemKey == i.ItemKey)
                && (ProjectKey == null || ProjectKey == i.Project.ProjectKey)
                && (ItemType == null || ItemType == i.Type);
        }
    }

    public class AddItemParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ItemType Type { get; set; }
    }

    public class UpdateItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public interface IItemService
    {
        Task<Item> GetItemAsync(ItemCriteria criteria);

        Task<Item> GetItemAsync(string itemKey);

        Task<List<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task DeleteItemAsync(string itemKey);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        public ItemService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
    }
}