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
        private readonly IItemService _itemService;

        public EvalController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost("{itemKey}")]
        public async Task<Result<SData>> EvalItem([FromRoute] string itemKey, [FromBody] Dictionary<string, JToken> parameters)
        {
            return new Result<SData>()
            {
                Data = await _itemService.EvalItem(itemKey, parameters)
            };
        }
    }
}