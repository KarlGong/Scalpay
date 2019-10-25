using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services.AuditService;
using Scalpay.Services.ExpressionService;

namespace Scalpay.Services.ItemService
{
    public interface IItemService
    {
        Task<Item> GetItemAsync(ItemCriteria criteria);

        Task<ListResults<Item>> GetItemsAsync(ItemCriteria criteria);

        Task<Item> AddItemAsync(Item item);
    }

    public class ItemService : IItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;
        private readonly IAuditService _auditService;

        public ItemService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper,
            IExpressionService expService, IAuditService auditService)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
            _expService = expService;
            _auditService = auditService;
        }


        public async Task<Item> GetItemAsync(ItemCriteria criteria)
        {
            var item = await _context.Items.AsNoTracking().Include(i => i.Rules).FirstOrDefaultAsync(criteria);
            if (item == null)
            {
                throw new NotFoundException("The item cannot be found.");
            }

            return item;
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
            if (await _context.Items.AsNoTracking().AnyAsync(i => i.ProjectKey == item.ProjectKey && i.ItemKey == item.ItemKey))
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
    }
}