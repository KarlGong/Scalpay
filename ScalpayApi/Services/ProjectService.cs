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
        Task<List<Project>> GetLatestProjectsAsync(ProjectCriteria criteria);

        Task<int> GetLatestProjectsCountAsync(ProjectCriteria criteria);

        Task<Project> GetProjectAsync(string projectKey, int? version);
        
        Task<Project> AddProjectAsync(AddProjectParams ps);

        Task<Project> UpdateProjectAsync(UpdateProjectParams ps);
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

        public async Task<List<Project>> GetLatestProjectsAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.AsNoTracking().OrderBy(p => p.ProjectKey).Where(p => p.IsLatest)
                .WithCriteria(criteria).ToListAsync();
        }

        public async Task<int> GetLatestProjectsCountAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.AsNoTracking().Where(p => p.IsLatest).CountAsync(criteria);
        }

        public async Task<Project> GetProjectAsync(string projectKey, int? version)
        {
            if (version == null)
            {
                var project = await _context.Projects.AsNoTracking()
                    .SingleOrDefaultAsync(p => p.ProjectKey == projectKey && p.IsLatest);
                if (project == null)
                {
                    throw new ScalpayException(StatusCode.ProjectNotFound,
                        $"Project with project key {projectKey} is not found.");
                }

                return project;
            }
            else
            {
                var project = await _context.Projects.AsNoTracking()
                    .SingleOrDefaultAsync(p => p.ProjectKey == projectKey && p.Version == version);
                if (project == null)
                {
                    throw new ScalpayException(StatusCode.ProjectNotFound,
                        $"Project with project key {projectKey}, version {version} is not found.");
                }

                return project;
            }
        }

        public async Task<Project> AddProjectAsync(AddProjectParams ps)
        {
            ps.ProjectKey = ps.ProjectKey.ToLower();

            if (await _context.Projects.AsNoTracking()
                .AnyAsync(p => p.ProjectKey == ps.ProjectKey))
            {
                throw new ScalpayException(StatusCode.ProjectExisted,
                    $"Project with project key {ps.ProjectKey} is already existed.");
            }

            var project = _mapper.Map<Project>(ps);
            project.Version = 1;
            project.IsLatest = true;

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.AddProject,
                ProjectKey = ps.ProjectKey,
                Args = new
                {
                    ProjectVersion = project.Version
                }
            });

            return project;
        }

        public async Task<Project> UpdateProjectAsync(UpdateProjectParams ps)
        {
            var latestProject = await GetProjectAsync(ps.ProjectKey, null);
            _context.Projects.Attach(latestProject);

            var project = _mapper.Map<Project>(ps);
            project.Version = latestProject.Version + 1;
            project.IsLatest = true;
            latestProject.IsLatest = false;

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            await _auditService.AddAuditAsync(new AddAuditParams()
            {
                AuditType = AuditType.UpdateProject,
                ProjectKey = ps.ProjectKey,
                Args = new
                {
                    FromProjectVersion = latestProject.Version,
                    ToProjectVersion = project.Version
                }
            });

            return project;
        }
    }
}