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

        public EvalController(IConfigItemService configItemService, IWordItemService wordItemService)
        {
            _configItemService = configItemService;
            _wordItemService = wordItemService;
        }

        [HttpPost("config/{itemKey}")]
        public async Task<Result<SData>> EvalConfigItem([FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            return new Result<SData>()
            {
                Data = await _configItemService.EvalConfigItem(itemKey, parameters)
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