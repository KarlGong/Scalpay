using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class AddFolderParams
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public int ProjectId { get; set; }

        public int? ParentFolderId { get; set; }
    }

    public class UpdateFolderPramas
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public interface IFolderService
    {
        Task<Folder> GetAsync(int id);

        Task<Folder> AddAsync(AddFolderParams ps);

        Task<Folder> UpdateAsync(UpdateFolderPramas ps);

        Task DeleteAsync(int id);

        Task<List<Folder>> GetFolders(int projectId, int? parentFolderId);
    }

    public class FolderService : IFolderService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        public FolderService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Folder> GetAsync(int id)
        {
            return await _context.Folders.SingleAsync(f => f.Id == id);
        }

        public async Task<Folder> AddAsync(AddFolderParams ps)
        {
            var folder = _mapper.Map<Folder>(ps);

            await _context.Folders.AddAsync(folder);

            await _context.SaveChangesAsync();

            return folder;
        }

        public async Task<Folder> UpdateAsync(UpdateFolderPramas ps)
        {
            var previousFolder = await GetAsync(ps.Id);

            _mapper.Map(ps, previousFolder);

            await _context.SaveChangesAsync();

            return previousFolder;
        }

        public async Task DeleteAsync(int id)
        {
            _context.Folders.Remove(await GetAsync(id));

            await _context.SaveChangesAsync();
        }

        public async Task<List<Folder>> GetFolders(int projectId, int? parentFolderId)
        {
            return await _context.Folders
                .Where(f => f.ProjectId == projectId && f.ParentFolderId == parentFolderId)
                .OrderBy(f => f.Name)
                .ToListAsync();
        }
    }
}