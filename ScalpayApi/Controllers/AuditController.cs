using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scalpay.Models;
using Scalpay.Services;
using Scalpay.Services.AuditService;

namespace Scalpay.Controllers
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
        public async Task<ListResults<List<Audit>>> GetAudits([FromQuery] AuditCriteria criteria)
        {
            return new ListResults<List<Audit>>()
            {
                Data = await _service.GetAuditsAsync(criteria),
                TotalCount = await _service.GetAuditsCountAsync(criteria)
            };
        }
    }
}