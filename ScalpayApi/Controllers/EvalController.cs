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
    public class EvalController : Controller
    {
        private readonly IConfigItemService _configItemService;
        private readonly IWordItemService _wordItemService;
        private readonly IExpressionService _expService;

        public EvalController(IConfigItemService configItemService, IWordItemService wordItemService,
            IExpressionService expService)
        {
            _configItemService = configItemService;
            _wordItemService = wordItemService;
            _expService = expService;
        }

        [HttpPost("config/{itemKey}")]
        public async Task<Result<SData>> EvalConfigItem([FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            var item = await _configItemService.GetConfigItemAsync(itemKey);

            var variables = new Dictionary<string, SData>();

            foreach (var pair in parameters)
            {
                var parameterInfo = item.ParameterInfos.SingleOrDefault(p => p.Name == pair.Key);

                if (parameterInfo == null)
                    continue; // data type not found, since paramter is not decalred in parameter list.

                variables.Add(pair.Key, await _expService.ConvertToSDataAsync(pair.Value, parameterInfo.DataType));
            }

            return new Result<SData>()
            {
                Data = await _configItemService.EvalConfigItem(item, variables)
            };
        }

        [HttpGet("config/{itemKey}")]
        public async Task<Result<SData>> EvalConfigPropertyItem([FromRoute] string itemKey)
        {
            var item = await _configItemService.GetConfigItemAsync(itemKey);

            return new Result<SData>()
            {
                Data = await _configItemService.EvalConfigItem(item, new Dictionary<string, SData>())
            };
        }

        [HttpGet("word/{itemKey}")]
        public async Task<Result<string>> EvalWordItem([FromRoute] string itemKey, [FromQuery] string lng)
        {
            return new Result<string>()
            {
                Data = await _wordItemService.EvalWordItemAsync(itemKey, lng)
            };
        }
        
        [HttpPost("word")]
        public async Task<Result<Dictionary<string, string>>> EvalWordItems([FromBody] List<string> itemKeys, [FromQuery] string lng)
        {
            return new Result<Dictionary<string, string>>()
            {
                Data = await _wordItemService.EvalWordItemsAsync(itemKeys, lng)
            };
        }
    }
}