﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
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

        Task<SData> EvalConfigItem(ConfigItem configItem, Dictionary<string, SData> parameters);
    }

    public class ConfigItemService : IConfigItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;

        public ConfigItemService(ScalpayDbContext context, IMapper mapper, IExpressionService expService)
        {
            _context = context;
            _mapper = mapper;
            _expService = expService;
        }

        public async Task<ConfigItem> GetConfigItemAsync(string itemKey)
        {
            var item = await _context.ConfigItems.AsNoTracking().Include(i => i.Project).Include(i => i.Rules)
                .SingleOrDefaultAsync(i => i.ItemKey == itemKey);
            if (item == null)
            {
                throw new ItemNotFoundException($"Config item with item key {itemKey} is not found.");
            }

            item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

            return item;
        }

        public async Task<ConfigItem> AddConfigItemAsync(AddConfigItemParams ps)
        {
            var item = _mapper.Map<ConfigItem>(ps);
            
            var order = 0;
            item.Rules.ForEach(rule => rule.Order = order++);

            await _context.ConfigItems.AddAsync(item);

            await _context.SaveChangesAsync();

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

            return item;
        }

        public async Task DeleteConfigItemAsync(string itemKey)
        {
            _context.ConfigItems.Remove(await GetConfigItemAsync(itemKey));

            await _context.SaveChangesAsync();
        }

        public async Task<SData> EvalConfigItem(ConfigItem configItem, Dictionary<string, SData> parameters)
        {
            foreach (var rule in configItem.Rules.OrderBy(r => r.Order))
            {
                if (((SBool) await _expService.EvalExpressionAsync(rule.Condition, parameters)).Inner)
                {
                    return await _expService.EvalExpressionAsync(rule.Result, parameters);
                }
            }

            return await _expService.EvalExpressionAsync(configItem.DefaultResult, parameters);
        }
    }
}