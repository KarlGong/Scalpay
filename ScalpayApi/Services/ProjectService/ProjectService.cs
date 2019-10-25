using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services.AuditService;

namespace Scalpay.Services.ProjectService
{
    public interface IProjectService
    {
        Task<Project> GetProjectAsync(ProjectCriteria criteria);

        Task<ListResults<Project>> GetProjectsAsync(ProjectCriteria criteria);
        
        Task<Project> AddProjectAsync(Project project);
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

        public async Task<Project> GetProjectAsync(ProjectCriteria criteria)
        {
            var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(criteria);
            if (project == null)
            {
                throw new NotFoundException("This project cannot be found.");
            }

            return project;
        }

        public async Task<ListResults<Project>> GetProjectsAsync(ProjectCriteria criteria)
        {
            return new ListResults<Project>()
            {
                Data = await _context.Projects.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Projects.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<Project> AddProjectAsync(Project project)
        {
            if (await _context.Projects.AsNoTracking().AnyAsync(p => p.ProjectKey == project.ProjectKey))
            {
                throw new ConflictException($"Project with key {project.ProjectKey} is already existing.");
            }

            await _context.Projects.AddAsync(project);

            await _context.SaveChangesAsync();

            return project;
        }
    }
}