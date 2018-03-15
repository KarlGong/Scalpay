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
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
    public interface IConfigItemService
    {
        Task<ConfigItem> GetConfigItemAsync(string itemKey);

        Task<ConfigItem> AddConfigItemAsync(AddConfigItemParams ps);

        Task<ConfigItem> UpdateConfigItemAsync(UpdateConfigItemParams ps);

        Task DeleteConfigItemAsync(string itemKey);

        Task<SData> EvalConfigItem(string itemKey, Dictionary<string, JToken> parameters);
    }

    public class ConfigItemService : IConfigItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;

        public ConfigItemService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper,
            IExpressionService expService)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
            _expService = expService;
        }

        public async Task<ConfigItem> GetConfigItemAsync(string itemKey)
        {
            return await _cache.GetOrCreateAsync(itemKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);

                var item = await _context.ConfigItems.AsNoTracking().Include(i => i.Project).Include(i => i.Rules)
                    .SingleOrDefaultAsync(i => i.ItemKey == itemKey);
                if (item == null)
                {
                    throw new ScalpayException(StatusCode.ItemNotFound,
                        $"Config item with item key {itemKey} is not found.");
                }

                item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

                return item;
            });
        }

        public async Task<ConfigItem> AddConfigItemAsync(AddConfigItemParams ps)
        {
            var oldItem = await _context.ConfigItems.AsNoTracking().SingleOrDefaultAsync(i => i.ItemKey == ps.ItemKey);

            if (oldItem != null)
            {
                throw new ScalpayException(StatusCode.ItemExisted,
                    $"Config item with item key {ps.ItemKey} is already existed.");
            }

            var item = _mapper.Map<ConfigItem>(ps);

            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);

            await _context.ConfigItems.AddAsync(item);

            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));

            return item;
        }

        public async Task<ConfigItem> UpdateConfigItemAsync(UpdateConfigItemParams ps)
        {
            var item = await GetConfigItemAsync(ps.ItemKey);

            _context.ConfigItems.Attach(item);

            _mapper.Map(ps, item);

            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);

            await _context.SaveChangesAsync();

            _cache.Set(item.ItemKey, item, TimeSpan.FromHours(1));

            return item;
        }

        public async Task DeleteConfigItemAsync(string itemKey)
        {
            _context.ConfigItems.Remove(await GetConfigItemAsync(itemKey));

            await _context.SaveChangesAsync();

            _cache.Remove(itemKey);
        }

        public async Task<SData> EvalConfigItem(string itemKey, Dictionary<string, JToken> parameters)
        {
            var item = await GetConfigItemAsync(itemKey);

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