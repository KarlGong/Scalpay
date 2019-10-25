using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Scalpay.Data;
using Scalpay.Models;

namespace Scalpay.Services.AuditService
{
    public interface IAuditService
    {
        Task<ListResults<Audit>> GetAuditsAsync(AuditCriteria criteria);

        Task<Audit> AddAuditAsync(Audit audit);
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

        public async Task<ListResults<Audit>> GetAuditsAsync(AuditCriteria criteria)
        {
            return new ListResults<Audit>()
            {
                Data = await _context.Audits.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Audits.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Audit> AddAuditAsync(Audit audit)
        {
            audit.InsertTime = DateTime.UtcNow;
            audit.UpdateTime = DateTime.UtcNow;

            await _context.Audits.AddAsync(audit);

            await _context.SaveChangesAsync();

            return audit;
        }
    }
}