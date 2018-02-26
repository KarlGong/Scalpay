using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi.Services.SExpression;

namespace ScalpayApi.Controllers
{
    [Route("api/eval")]
    public class EvalController: Controller
    {
        private readonly IItemService _service;

        public EvalController(IItemService service)
        {
            _service = service;
        }
        
        [HttpPost("{itemKey}")]
        public async Task<SData> EvalItem([FromRoute] string itemKey, [FromBody] JToken paramters)
        {
            return await _service.EvalItem(itemKey, paramters);
        }
    }
}