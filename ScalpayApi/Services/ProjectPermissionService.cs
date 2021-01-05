using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services.Query;

namespace Scalpay.Services
{
    public class ProjectPermissionCriteria : Criteria<ProjectPermission>
    {
        public string ProjectKey { get; set; }

        public string Username { get; set; }

        public override Expression<Func<ProjectPermission, bool>> ToWherePredicate()
        {
            return p => (ProjectKey == null || ProjectKey == p.ProjectKey)
                        && (Username == null || Username == p.Username);
        }
    }

    public class UpsertProjectPermissionParams
    {
        public string ProjectKey { set; get; }

        public string Username { get; set; }

        public Permission Permission { get; set; }
    }

    public interface IProjectPermissionService
    {
        Task<ProjectPermission> GetProjectPermissionAsync(string projectKey, string username);

        Task<ProjectPermission> GetCachedProjectPermissionAsync(string projectKey, string username);

        Task<QueryResults<ProjectPermission>> GetProjectPermissionsAsync(ProjectPermissionCriteria criteria);

        Task<ProjectPermission> AddProjectPermissionAsync(UpsertProjectPermissionParams ps);

        Task<ProjectPermission> UpdateProjectPermissionAsync(UpsertProjectPermissionParams ps);

        Task DeleteProjectPermissionAsync(string projectKey, string username);
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

        public async Task<ProjectPermission> GetProjectPermissionAsync(string projectKey, string username)
        {
            var permission = await _context.ProjectPermissions.AsNoTracking().FirstOrDefaultAsync(pp => pp.ProjectKey == projectKey && pp.Username == username);
            if (permission == null)
            {
                throw new NotFoundException($"Project permission {username}@{projectKey} cannot be found.");
            }

            return permission;
        }

        public async Task<ProjectPermission> GetCachedProjectPermissionAsync(string projectKey, string username)
        {
            return await _cache.GetOrCreateAsync($"project-permission-{projectKey}-{username}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetProjectPermissionAsync(projectKey, username);
            });
        }

        public async Task<QueryResults<ProjectPermission>> GetProjectPermissionsAsync(ProjectPermissionCriteria criteria)
        {
            return new QueryResults<ProjectPermission>()
            {
                Value = await _context.ProjectPermissions.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.ProjectPermissions.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<ProjectPermission> AddProjectPermissionAsync(UpsertProjectPermissionParams ps)
        {
            if (await _context.ProjectPermissions.AsNoTracking().AnyAsync(pp => pp.ProjectKey == ps.ProjectKey && pp.Username == ps.Username))
            {
                throw new ConflictException($"Project permission {ps.Username}@{ps.ProjectKey} is already existing.");
            }

            var permission = _mapper.Map<ProjectPermission>(ps);

            await _context.ProjectPermissions.AddAsync(permission);

            await _context.SaveChangesAsync();

            return permission;
        }

        public async Task<ProjectPermission> UpdateProjectPermissionAsync(UpsertProjectPermissionParams ps)
        {
            _cache.Remove($"project-permission-{ps.ProjectKey}-{ps.Username}");

            var oldPermission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectKey == ps.ProjectKey && pp.Username == ps.Username);
            if (oldPermission == null)
            {
                throw new NotFoundException($"Project permission {ps.Username}@{ps.ProjectKey} cannot be found.");
            }

            _mapper.Map(ps, oldPermission);

            await _context.SaveChangesAsync();

            return oldPermission;
        }

        public async Task DeleteProjectPermissionAsync(string projectKey, string username)
        {
            _cache.Remove($"project-permission-{projectKey}-{username}");

            var oldPermission = await _context.ProjectPermissions.FirstOrDefaultAsync(pp => pp.ProjectKey == projectKey && pp.Username == username);
            if (oldPermission == null)
            {
                throw new NotFoundException($"Project permission {username}@{projectKey} cannot be found.");
            }

            _context.ProjectPermissions.Remove(oldPermission);
            await _context.SaveChangesAsync();
        }
    }
}