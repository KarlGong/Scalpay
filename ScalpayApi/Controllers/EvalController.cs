using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ScalpayApi.Services;
using ScalpayApi.Services.SExpressions;

namespace ScalpayApi.Controllers
{
    [Route("api/eval")]
    public class EvalController: Controller
    {
        private readonly IItemConfigService _itemConfigService;
        private readonly IExpressionService _expService;

        public EvalController(IItemConfigService itemConfigService, IExpressionService expService)
        {
            _itemConfigService = itemConfigService;
            _expService = expService;
        }
        
        [HttpPost("config/{itemKey}")]
        public async Task<SData> EvalItem([FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            var item = await _itemConfigService.GetItemConfigAsync(itemKey);
            
            var variables = new Dictionary<string, SData>();

            foreach (var pair in parameters)
            {
                var parameterInfo = item.ParameterInfos.SingleOrDefault(p => p.Name == pair.Key);
                
                if (parameterInfo == null) continue; // data type not found, since paramter is not decalred in parameter list.

                variables.Add(pair.Key, await _expService.ConvertToSDataAsync(pair.Value, parameterInfo.DataType));
            }
            
            return await _itemConfigService.EvalItemConfig(item, variables);
        }
    }
}