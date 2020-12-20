using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;

namespace Scalpay.Services
{
    public class UpsertProjectParams
    {
        public string Id { get; set; }
        
        public string Description { get; set; }
    }
    
    public interface IProjectService
    {
        Task<Project> GetProjectAsync(string id);

        Task<Project> AddProjectAsync(UpsertProjectParams ps);

        Task<Project> UpdateProjectAsync(UpsertProjectParams ps);

        Task DeleteProjectAsync(string id);
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

        public async Task<Project> GetProjectAsync(string id)
        {
            var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                throw new NotFoundException($"The project {id} cannot be found.");
            }

            return project;
        }

        public async Task<Project> AddProjectAsync(UpsertProjectParams ps)
        {
            if (await _context.Projects.AsNoTracking().AnyAsync(p => p.Id == ps.Id))
            {
                throw new ConflictException($"Project with id {ps.Id} is already existing.");
            }

            var project = _mapper.Map<Project>(ps);

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateProjectAsync(UpsertProjectParams ps)
        {
            var oldProject = await _context.Projects.FirstOrDefaultAsync(p => p.Id == ps.Id);
            if (oldProject == null)
            {
                throw new NotFoundException($"The project {ps.Id} cannot be found.");
            }

            _mapper.Map(ps, oldProject);

            await _context.SaveChangesAsync();

            return oldProject;
        }

        public async Task DeleteProjectAsync(string id)
        {
            var oldProject = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (oldProject != null)
            {
                if (await _context.Items.AnyAsync(i => i.ProjectId == id))
                {
                    throw new ConflictException("Cannot delete this project, since some items are under this institution.");
                }

                _context.ProjectPermissions.RemoveRange(_context.ProjectPermissions.Where(pp => pp.ProjectId == id));
                _context.Projects.Remove(oldProject);
                await _context.SaveChangesAsync();
            }
        }
    }
}