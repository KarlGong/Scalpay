using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services.Exceptions;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services
{
    public interface IProjectService
    {
        Task<Project> GetProjectAsync(string projectKey);

        Task<List<Project>> GetProjectsAsync(ProjectCriteria criteria);

        Task<int> GetProjectsCountAsync(ProjectCriteria criteria);

        Task<Project> AddProjectAsync(AddProjectParams ps);

        Task<Project> UpdateProjectAsync(UpdateProjectParams ps);

        Task DeleteProjectAsync(string projectKey);
    }

    public class ProjectService : IProjectService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;

        public ProjectService(ScalpayDbContext context, IMapper mapper, IAuditService auditService)
        {
            _context = context;
            _mapper = mapper;
            _auditService = auditService;
        }

        public async Task<Project> GetProjectAsync(string projectKey)
        {
            var project = await _context.Projects.AsNoTracking().SingleOrDefaultAsync(p => p.ProjectKey == projectKey);
            if (project == null)
            {
                throw new ScalpayException(StatusCode.ProjectNotFound, $"Project with project key {projectKey} is not found.");
            }

            return project;
        }

        public async Task<List<Project>> GetProjectsAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.AsNoTracking().OrderBy(p => p.ProjectKey).WithCriteria(criteria).ToListAsync();
        }

        public async Task<int> GetProjectsCountAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.AsNoTracking().CountAsync(criteria);
        }

        public async Task<Project> AddProjectAsync(AddProjectParams ps)
        {
            var oldProject = await _context.Projects.AsNoTracking()
                .SingleOrDefaultAsync(p => p.ProjectKey == ps.ProjectKey);

            if (oldProject != null)
            {
                throw new ScalpayException(StatusCode.ProjectExisted, $"Project with project key {ps.ProjectKey} is already existed.");
            }

            var project = _mapper.Map<Project>(ps);

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();
            
            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.AddProject,
                ProjectKey = ps.ProjectKey,
            });

            return project;
        }

        public async Task<Project> UpdateProjectAsync(UpdateProjectParams ps)
        {
            var project = await GetProjectAsync(ps.ProjectKey);

            _context.Projects.Attach(project);

            _mapper.Map(ps, project);

            await _context.SaveChangesAsync();
            
            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.UpdateProject,
                ProjectKey = ps.ProjectKey,
            });

            return project;
        }

        public async Task DeleteProjectAsync(string projectKey)
        {
            var project = await GetProjectAsync(projectKey);
            
            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();
            
            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.DeleteProject,
                ProjectKey = projectKey,
            });
        }
    }
}