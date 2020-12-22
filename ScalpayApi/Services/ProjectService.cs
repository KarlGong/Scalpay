using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services.Query;

namespace Scalpay.Services
{
    public class ProjectCriteria : Criteria<Project>
    {
        public string ProjectKey { get; set; }
        
        public string Keyword { get; set; }

        public override Expression<Func<Project, bool>> ToWherePredicate()
        {
            return p => (ProjectKey == null || ProjectKey == p.ProjectKey)
                        && (Keyword == null
                            || p.ProjectKey.Contains(Keyword)
                            || p.Description.Contains(Keyword));
        }
    }
    
    public class UpsertProjectParams
    {
        public string ProjectKey { get; set; }
        
        public string Description { get; set; }
    }
    
    public interface IProjectService
    {
        Task<Project> GetProjectAsync(string projectKey);
        
        Task<QueryResults<Project>> GetProjectsAsync(ProjectCriteria criteria);

        Task<Project> AddProjectAsync(UpsertProjectParams ps);

        Task<Project> UpdateProjectAsync(UpsertProjectParams ps);

        Task DeleteProjectAsync(string projectKey);
    }

    public class ProjectService : IProjectService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        public ProjectService(ScalpayDbContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<Project> GetProjectAsync(string projectKey)
        {
            var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.ProjectKey == projectKey);
            if (project == null)
            {
                throw new NotFoundException($"The project {projectKey} cannot be found.");
            }

            return project;
        }

        public async Task<QueryResults<Project>> GetProjectsAsync(ProjectCriteria criteria)
        {
            return new QueryResults<Project>()
            {
                Value = await _context.Projects.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Projects.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Project> AddProjectAsync(UpsertProjectParams ps)
        {
            if (await _context.Projects.AsNoTracking().AnyAsync(p => p.ProjectKey == ps.ProjectKey))
            {
                throw new ConflictException($"Project with key {ps.ProjectKey} is already existing.");
            }

            var project = _mapper.Map<Project>(ps);

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateProjectAsync(UpsertProjectParams ps)
        {
            var oldProject = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectKey == ps.ProjectKey);
            if (oldProject == null)
            {
                throw new NotFoundException($"The project {ps.ProjectKey} cannot be found.");
            }

            _mapper.Map(ps, oldProject);

            await _context.SaveChangesAsync();

            return oldProject;
        }

        public async Task DeleteProjectAsync(string projectKey)
        {
            var oldProject = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectKey == projectKey);
            if (oldProject == null)
            {
                throw new NotFoundException($"The project {projectKey} cannot be found.");
            }
            
            if (await _context.Items.AnyAsync(i => i.ProjectKey == projectKey))
            {
                throw new ConflictException("Cannot delete this project, since some items are under this institution.");
            }

            _context.ProjectPermissions.RemoveRange(_context.ProjectPermissions.Where(pp => pp.ProjectKey == projectKey));
            _context.Projects.Remove(oldProject);
            await _context.SaveChangesAsync();
        }
    }
}