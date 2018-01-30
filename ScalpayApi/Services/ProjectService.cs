using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class AddProjectParams
    {
        public string Key { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public string URL { get; set; }
        
        public bool IsActive { get; set; }
    }
    
    public class UpdateProjectParams
    {
        public int Id { get; set; }
        
        public string Key { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public string URL { get; set; }
        
        public bool IsActive { get; set; }
    }

    public interface IProjectService
    {
        Task<List<Project>> GetAllAsync();

        Task<Project> GetAsync(int id);

        Task<Project> AddAsync(AddProjectParams ps);

        Task<Project> UpdateAsync(UpdateProjectParams ps);
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

        public async Task<List<Project>> GetAllAsync()
        {
            return await _context.Projects.OrderBy(p => p.Name).ToListAsync();
        }

        public async Task<Project> GetAsync(int id)
        {
            return await _context.Projects.SingleAsync(p => p.Id == id);
        }

        public async Task<Project> AddAsync(AddProjectParams ps)
        {
            var project = _mapper.Map<Project>(ps);
            
            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateAsync(UpdateProjectParams ps)
        {
            var previousProject = await GetAsync(ps.Id);

            _mapper.Map(ps, previousProject);

            await _context.SaveChangesAsync();

            return previousProject;
        }
    }
}