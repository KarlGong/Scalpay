using System;
using System.Collections.Generic;
using System.Linq;
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

namespace Scalpay.Services
{
    public class UpsertItemParams
    {
        public string Id { get; set; }

        public string ProjectId { get; set; }
        
        public string Description { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }

        public SExpression DefaultResult { get; set; }

        public List<Rule> Rules { get; set; }
    }


    public interface IItemService
    {
        Task<Item> GetItemAsync(string id);

        Task<Item> GetCachedItemAsync(string id);

        Task<Item> AddItemAsync(UpsertItemParams ps);

        Task<Item> UpdateItemAsync(UpsertItemParams ps);

        Task DeleteItemAsync(string id);
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

        public async Task<Item> GetItemAsync(string id)
        {
            var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
            if (item == null)
            {
                throw new NotFoundException($"The item {id} cannot be found.");
            }

            return item;
        }

        public async Task<Item> GetCachedItemAsync(string id)
        {
            return await _cache.GetOrCreateAsync($"item-{id}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetItemAsync(id);
            });
        }

        public async Task<Item> AddItemAsync(UpsertItemParams ps)
        {
            if (await _context.Items.AsNoTracking().AnyAsync(i => i.Id == ps.Id))
            {
                throw new ConflictException($"Item with id {ps.Id} is already existing.");
            }

            var item = _mapper.Map<Item>(ps);

            await _context.Items.AddAsync(item);
            
            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpsertItemParams ps)
        {
            _cache.Remove($"item-{ps.Id}");
            
            var oldItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == ps.Id);
            if (oldItem == null)
            {
                throw new NotFoundException($"Item {ps.Id} cannot be found.");
            }

            _mapper.Map(ps, oldItem);

            await _context.SaveChangesAsync();

            return oldItem;
        }

        public async Task DeleteItemAsync(string id)
        {
            _cache.Remove($"item-{id}");
            
            var oldItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);
            if (oldItem != null)
            {
                _context.Items.Remove(oldItem);
                await _context.SaveChangesAsync();
            }
        }
    }
}