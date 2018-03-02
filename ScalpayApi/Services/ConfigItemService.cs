using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Services
{
    public class AddConfigItemParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ConfigItemMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }

        public List<Rule> Rules { get; set; }
    }

    public class UpdateConfigItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ConfigItemMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }

        public List<Rule> Rules { get; set; }
    }

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
            var item = await _context.ConfigItems.Include(i => i.Project).Include(i => i.Rules)
                .SingleOrDefaultAsync(i => i.ItemKey == itemKey);

            item.Rules = item.Rules.OrderBy(r => r.Order).ToList();

            return item;
        }

        public async Task<ConfigItem> AddConfigItemAsync(AddConfigItemParams ps)
        {
            var order = 0;
            ps.Rules.ForEach(rule => rule.Order = order++);

            var item = _mapper.Map<ConfigItem>(ps);

            await _context.ConfigItems.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<ConfigItem> UpdateConfigItemAsync(UpdateConfigItemParams ps)
        {
            var order = 0;
            ps.Rules.ForEach(rule => rule.Order = order++);

            var previousItem = await GetConfigItemAsync(ps.ItemKey);

            _context.ConfigItems.Attach(previousItem);

            _mapper.Map(ps, previousItem);

            await _context.SaveChangesAsync();

            return previousItem;
        }

        public async Task DeleteConfigItemAsync(string itemKey)
        {
            _context.ConfigItems.Remove(await GetConfigItemAsync(itemKey));

            await _context.SaveChangesAsync();
        }

        public async Task<SData> EvalConfigItem(ConfigItem configItem, Dictionary<string, SData> parameters)
        {
            foreach (var rule in configItem.Rules.Where(r => r.Condition != null).OrderBy(r => r.Order))
            {
                if (((SBool) await _expService.EvalExpressionAsync(rule.Condition, parameters)).Inner)
                {
                    return await _expService.EvalExpressionAsync(rule.Result, parameters);
                }
            }

            var defaultRule = configItem.Rules.Single(r => r.Condition == null);

            return await _expService.EvalExpressionAsync(defaultRule.Result, parameters);
        }
    }
}