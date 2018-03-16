using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Models;
using ScalpayApi.Services;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Controllers
{
    [Route("api/audits")]
    public class AuditController : Controller
    {
        private readonly IAuditService _service;

        public AuditController(IAuditService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<Result<List<Audit>>> GetAudits([FromQuery] AuditCriteria criteria)
        {
            return new Result<List<Audit>>()
            {
                Data = await _service.GetAuditsAsync(criteria),
                TotalCount = await _service.GetAuditsCountAsync(criteria)
            };
        }
    }
}