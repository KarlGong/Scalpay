using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Services
{
    public class UpsertProjectPermissionParams
    {
        public string ProjectId { set; get; }
        
        public int UserId { get; set; }

        public Permission Permission { get; set; }
    }

    public interface IProjectPermissionService
    {
        Task<ProjectPermission> GetProjectPermissionAsync(string projectId, int userId);

        Task<ProjectPermission> GetCachedProjectPermissionAsync(string projectId, int userId);

        Task<ProjectPermission> UpdateProjectPermissionAsync(UpsertProjectPermissionParams ps);
    }


    public class ProjectPermissionService : IProjectPermissionService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMapper _mapper;

        public ProjectPermissionService(ScalpayDbContext context, IMemoryCache cache, IMapper mapper)
        {
            _context = context;
            _cache = cache;
            _mapper = mapper;
        }

        public async Task<ProjectPermission> GetProjectPermissionAsync(string projectId, int userId)
        {
            var permission = await _context.ProjectPermissions.AsNoTracking().FirstOrDefaultAsync(pp => pp.ProjectId == projectId && pp.UserId == userId);
            if (permission == null)
            {
                return new ProjectPermission()
                {
                    ProjectId = projectId,
                    UserId = userId,
                    Permission = Permission.None
                };
            }

            return permission;
        }

        public async Task<ProjectPermission> GetCachedProjectPermissionAsync(string projectId, int userId)
        {
            return await _cache.GetOrCreateAsync($"project-permission-{projectId}-{userId}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetProjectPermissionAsync(projectId, userId);
            });
        }

        public async Task<ProjectPermission> UpdateProjectPermissionAsync(UpsertProjectPermissionParams ps)
        {
            _cache.Remove($"project-permission-{ps.ProjectId}-{ps.UserId}");
            
            var oldPermission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectId == ps.ProjectId && pp.UserId == ps.UserId);
            if (oldPermission == null)
            {
                if (ps.Permission.Equals(Permission.None))
                {
                    return new ProjectPermission()
                    {
                        ProjectId = ps.ProjectId,
                        UserId = ps.UserId,
                        Permission = Permission.None
                    };
                }

                var projectPermission = _mapper.Map<ProjectPermission>(ps);
                await _context.ProjectPermissions.AddAsync(projectPermission);
                await _context.SaveChangesAsync();

                return projectPermission;
            }
            
            if (ps.Permission.Equals(Permission.None))
            {
                _context.ProjectPermissions.Remove(oldPermission);
                await _context.SaveChangesAsync();
                return new ProjectPermission()
                {
                    ProjectId = ps.ProjectId,
                    UserId = ps.UserId,
                    Permission = Permission.None
                }; 
            }

            _mapper.Map(ps, oldPermission);
            await _context.SaveChangesAsync();

            return oldPermission;
        }
    }
}