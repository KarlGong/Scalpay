using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using ScalpayApi.Data;
using ScalpayApi.Models;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
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