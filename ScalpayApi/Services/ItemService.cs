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

    public interface IItemService
    {
        Task<List<Item>> GetItemsAsync(ItemCriteria criteria);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;

        public ItemService(ScalpayDbContext context)
        {
            _context = context;
        }

        public async Task<List<Item>> GetItemsAsync(ItemCriteria criteria)
        {
            return await _context.Items.Include(i => i.Project).Where(criteria.ToWherePredicate()).ToListAsync();
        }
    }
}