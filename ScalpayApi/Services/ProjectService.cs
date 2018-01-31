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
    public class AddProjectParams
    {
        public string ProjectKey { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public bool IsActive { get; set; }
    }
    
    public class UpdateProjectParams
    {
        public string ProjectKey { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public bool IsActive { get; set; }
    }

    public interface IProjectService
    {
        Task<Project> GetProjectAsync(string projectKey);

        Task<Project> AddProjectAsync(AddProjectParams ps);

        Task<Project> UpdateProjectAsync(UpdateProjectParams ps);
        
        Task<List<Item>> GetItems(string projectKey, ItemType itemType);
    }

    public class ProjectService: IProjectService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;

        public ProjectService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Project> GetProjectAsync(string projectKey)
        {
            return await _context.Projects.SingleAsync(p => p.ProjectKey == projectKey);
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
        
        public async Task<List<Item>> GetItems(string projectKey, ItemType itemType)
        {
            return await _context.Items
                .Include(i => i.Project)
                .Where(i => i.Project.ProjectKey == projectKey && i.Type == itemType)
                .ToListAsync();
        }
    }
}