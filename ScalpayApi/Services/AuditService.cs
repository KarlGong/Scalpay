using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Models;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services
{
    public interface IAuditService
    {
        Task<List<Audit>> GetAuditsAsync(AuditCriteria criteria);

        Task<int> GetAuditsCountAsync(AuditCriteria criteria);

        Task<Audit> AddAuditAsync(AddAuditParams ps);
    }

    public class AuditService : IAuditService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _operator;

        public AuditService(ScalpayDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _operator = httpContextAccessor.HttpContext.User.FindFirstValue("Username");
        }

        public async Task<List<Audit>> GetAuditsAsync(AuditCriteria criteria)
        {
            return await _context.Audits.AsNoTracking().OrderByDescending(a => a.InsertTime).WithCriteria(criteria).ToListAsync();
        }

        public async Task<int> GetAuditsCountAsync(AuditCriteria criteria)
        {
            return await _context.Audits.AsNoTracking().CountAsync(criteria);
        }

        public async Task<Audit> AddAuditAsync(AddAuditParams ps)
        {
            var audit = _mapper.Map<Audit>(ps);

            audit.Operator = _operator;
            
            await _context.Audits.AddAsync(audit);

            await _context.SaveChangesAsync();

            return audit;
        }
    }
}