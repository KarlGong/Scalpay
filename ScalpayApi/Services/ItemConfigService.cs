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
    public class AddItemConfigParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ItemConfigMode Mode { get; set; }
        
        public List<ParameterInfo> ParameterInfos { get; set; }
        
        public SDataType ResultDataType { get; set; }
        
        public List<Rule> Rules { get; set; }
    }

    public class UpdateItemConfigParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public ItemConfigMode Mode { get; set; }
        
        public List<ParameterInfo> ParameterInfos { get; set; }
        
        public SDataType ResultDataType { get; set; }
        
        public List<Rule> Rules { get; set; }
    }
    
    public interface IItemConfigService
    {
        Task<ItemConfig> GetItemConfigAsync(string itemKey);

        Task<ItemConfig> AddItemConfigAsync(AddItemConfigParams ps);

        Task<ItemConfig> UpdateItemConfigAsync(UpdateItemConfigParams ps);

        Task DeleteItemConfigAsync(string itemKey);

        Task<SData> EvalItemConfig(ItemConfig item, Dictionary<string, SData> parameters);
    }
    
    public class ItemConfigService :IItemConfigService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly IExpressionService _expService;
        
        public ItemConfigService(ScalpayDbContext context, IMapper mapper, IExpressionService expService)
        {
            _context = context;
            _mapper = mapper;
            _expService = expService;
        }
        
        public async Task<ItemConfig> GetItemConfigAsync(string itemKey)
        {
            return await _context.ItemConfigs.Include(i => i.Project).SingleOrDefaultAsync(i => i.ItemKey == itemKey);
        }

        public async Task<ItemConfig> AddItemConfigAsync(AddItemConfigParams ps)
        {
            var item = _mapper.Map<ItemConfig>(ps);

            await _context.ItemConfigs.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<ItemConfig> UpdateItemConfigAsync(UpdateItemConfigParams ps)
        {
            var previousItem = await GetItemConfigAsync(ps.ItemKey);

            _mapper.Map(ps, previousItem);

            await _context.SaveChangesAsync();

            return previousItem;
        }

        public async Task DeleteItemConfigAsync(string itemKey)
        {
            _context.ItemConfigs.Remove(await GetItemConfigAsync(itemKey));

            await _context.SaveChangesAsync();
        }

        public async Task<SData> EvalItemConfig(ItemConfig item, Dictionary<string, SData> parameters)
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