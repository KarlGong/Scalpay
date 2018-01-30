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
    public class AddItemParams
    {
        public string Key { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public ItemType Type { get; set; }
        
        public int ProjectId { get; set; }
        
        public int? ParentFolderId { get; set; }
    }
    
    public class UpdateItemParams
    {
        public int Id { get; set; }
        
        public string Key { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
    }

    public interface IItemService
    {
        Task<Item> GetAsync(int id);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task DeleteAsync(int id);
        
        Task<List<Item>> GetItems(int projectId, int? parentFolderId);
    }

    public class ItemService: IItemService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        public ItemService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Item> GetAsync(int id)
        {
            return await _context.Items.SingleAsync(i => i.Id == id);
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var item = _mapper.Map<Item>(ps);

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemParams ps)
        {
            var previousItem = await GetAsync(ps.Id);

            _mapper.Map(ps, previousItem);

            await _context.SaveChangesAsync();

            return previousItem;
        }

        public async Task DeleteAsync(int id)
        {
            _context.Items.Remove(await GetAsync(id));

            await _context.SaveChangesAsync();
        }

        public async Task<List<Item>> GetItems(int projectId, int? parentFolderId)
        {
            return await _context.Items
                .Where(i => i.ProjectId == projectId && i.ParentFolderId == parentFolderId)
                .OrderBy(i => i.Name)
                .ToListAsync();
        }
    }
}