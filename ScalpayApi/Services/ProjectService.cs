using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class ProjectCriteria
    {
        public string ProjectKey { get; set; }
    }

    public class AddProjectParams
    {
        public string ProjectKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public class UpdateProjectParams
    {
        public string ProjectKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public interface IProjectService
    {
        Task<Project> GetProjectAsync(ProjectCriteria criteria);

        Task<Project> GetProjectAsync(string projectKey);

        Task<List<Project>> GetProjectsAsync(ProjectCriteria criteria);
        
        Task<List<Project>> GetProjectsAsync();

        Task<Project> AddProjectAsync(AddProjectParams ps);

        Task<Project> UpdateProjectAsync(UpdateProjectParams ps);

        Task DeleteProjectAsync(string projectKey);
    }

    public class ProjectService : IProjectService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;

        public ProjectService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Project> GetProjectAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.SingleOrDefaultAsync(p =>
                criteria.ProjectKey == null || criteria.ProjectKey == p.ProjectKey
            );
        }

        public async Task<Project> GetProjectAsync(string projectKey)
        {
            return await GetProjectAsync(new ProjectCriteria()
            {
                ProjectKey = projectKey
            });
        }

        public async Task<List<Project>> GetProjectsAsync(ProjectCriteria criteria)
        {
            return await _context.Projects.Where(p =>
                criteria.ProjectKey == null || criteria.ProjectKey == p.ProjectKey
            ).ToListAsync();
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<Project> AddProjectAsync(AddProjectParams ps)
        {
            var project = _mapper.Map<Project>(ps);

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateProjectAsync(UpdateProjectParams ps)
        {
            var previousProject = await GetProjectAsync(ps.ProjectKey);

            _mapper.Map(ps, previousProject);

            await _context.SaveChangesAsync();

            return previousProject;
        }

        public async Task DeleteProjectAsync(string projectKey)
        {
            _context.Projects.Remove(await GetProjectAsync(projectKey));

            await _context.SaveChangesAsync();
        }
    }
}