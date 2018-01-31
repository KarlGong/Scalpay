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
        public string ProjectKey { get; set; }
        
        public string ItemKey { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public ItemType Type { get; set; }
    }
    
    public class UpdateItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
    }

    public interface IItemService
    {
        Task<Item> GetItemAsync(string itemKey);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(UpdateItemParams ps);

        Task DeleteItemAsync(string itemKey);
    }

    public class ItemService: IItemService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        private readonly ProjectService _projectService;

        public ItemService(ScalpayDbContext context, IMapper mapper, ProjectService projectService)
        {
            _context = context;
            _mapper = mapper;
            _projectService = projectService;
        }

        public async Task<Item> GetItemAsync(string itemKey)
        {
            return await _context.Items.SingleAsync(i => i.ItemKey == itemKey);
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var item = _mapper.Map<Item>(ps);

            item.ProjectId = (await _projectService.GetProjectAsync(ps.ProjectKey)).Id;

            await _context.Items.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemParams ps)
        {
            var previousItem = await GetItemAsync(ps.ItemKey);

            _mapper.Map(ps, previousItem);

            await _context.SaveChangesAsync();

            return previousItem;
        }

        public async Task DeleteItemAsync(string itemKey)
        {
            _context.Items.Remove(await GetItemAsync(itemKey));

            await _context.SaveChangesAsync();
        }
    }
}