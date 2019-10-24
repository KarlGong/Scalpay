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
using Scalpay.Models;
using Scalpay.Services.Exceptions;
using Scalpay.Services.Parameters;
using Scalpay.Services.Parameters.Criterias;
using Scalpay.Services.SExpressions;

namespace Scalpay.Services
{
    public interface IItemService
    {
        Task<List<Item>> GetLatestItemsAsync(ItemCriteria criteria);

        Task<int> GetLatestItemsCountAsync(ItemCriteria criteria);
        
        Task<Item> GetItemAsync(string itemKey, int? version);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task<SData> EvalItem(string itemKey, Dictionary<string, JToken> parameters);
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
        
        public async Task<List<Item>> GetLatestItemsAsync(ItemCriteria criteria)
        {
            return await _context.Items.AsNoTracking().OrderBy(i => i.ItemKey).Where(i => i.IsLatest).WithCriteria(criteria)
                .ToListAsync();
        }

        public async Task<int> GetLatestItemsCountAsync(ItemCriteria criteria)
        {
            return await _context.Items.AsNoTracking().Where(i => i.IsLatest).CountAsync(criteria);
        }

        public async Task<Item> GetItemAsync(string itemKey, int? version)
        {
            if (version == null)
            {
                return await _cache.GetOrCreateAsync(itemKey, async entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);

                    var item = await _context.Items.AsNoTracking().Include(i => i.Rules)
                        .SingleOrDefaultAsync(i => i.ItemKey == itemKey && i.IsLatest);
                    if (item == null)
                    {
                        throw new ScalpayException(StatusCode.ItemNotFound,
                            $"Item with item key {itemKey} is not found.");
                    }

                    item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

                    return item;
                });
            }
            else
            {
                var item = await _context.Items.AsNoTracking().Include(i => i.Rules)
                    .SingleOrDefaultAsync(i => i.ItemKey == itemKey && i.Version == version);
                if (item == null)
                {
                    throw new ScalpayException(StatusCode.ItemNotFound,
                        $"Item with item key {itemKey}, version {version} is not found.");
                }

                item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

                return item;
            }
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            ps.ProjectKey = ps.ProjectKey.ToLower();
            ps.ItemKey = ps.ItemKey.ToLower();
            
            if (await _context.Items.AsNoTracking().AnyAsync(i => i.ItemKey == ps.ItemKey))
            {
                throw new ScalpayException(StatusCode.ItemExisted,
                    $"Item with item key {ps.ItemKey} is already existed.");
            }

            var item = _mapper.Map<Item>(ps);
            item.Version = 1;
            item.IsLatest = true;
            var order = 0;
            item.Rules.ForEach(rule =>
            {
                rule.Order = order++;
                rule.InsertTime = DateTime.UtcNow;
                rule.UpdateTime = DateTime.UtcNow;
            });
            item.InsertTime = DateTime.UtcNow;
            item.UpdateTime = DateTime.UtcNow;

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));

            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.AddItem,
                ProjectKey = ps.ProjectKey,
                ItemKey = ps.ItemKey,
                Args = new
                {
                    ItemVersion = item.Version
                }
            });

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemParams ps)
        {
            var latestItem = await GetItemAsync(ps.ItemKey, null);
            _context.Items.Attach(latestItem);

            var item = _mapper.Map<Item>(ps);
            item.ProjectKey = latestItem.ProjectKey;
            item.Version = latestItem.Version + 1;
            item.IsLatest = true;
            latestItem.IsLatest = false;
            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);
            item.InsertTime = DateTime.UtcNow;
            item.UpdateTime = DateTime.UtcNow;

            await _context.Items.AddAsync(item);
            
            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));
            
            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.UpdateItem,
                ProjectKey = item.ProjectKey,
                ItemKey = ps.ItemKey,
                Args = new
                {
                    FromItemVersion = latestItem.Version,
                    ToItemVersion = item.Version
                }
            });

            return item;
        }

        public async Task<SData> EvalItem(string itemKey, Dictionary<string, JToken> parameters)
        {
            var item = await GetItemAsync(itemKey, null);

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