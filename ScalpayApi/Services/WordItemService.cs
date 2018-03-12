using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Models;
using ScalpayApi.Services.Exceptions;
using ScalpayApi.Services.Parameters;

namespace ScalpayApi.Services
{
    public interface IWordItemService
    {
        Task<WordItem> GetWordItemAsync(string itemKey);

        Task<WordItem> AddWordItemAsync(AddWordItemParams ps);

        Task<WordItem> UpdateWordItemAsync(UpdateWordItemParams ps);

        Task DeleteWordItemAsync(string itemKey);

        Task<string> EvalWordItemAsync(string itemKey, string language);

        Task<Dictionary<string, string>> EvalWordItemsAsync(List<string> itemKeys, string language);
    }

    public class WordItemService : IWordItemService
    {
        private readonly ScalpayDbContext _context;
        private readonly IMapper _mapper;

        public WordItemService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<WordItem> GetWordItemAsync(string itemKey)
        {
            var item = await _context.WordItems.AsNoTracking().Include(i => i.Project).Include(i => i.WordInfos)
                .SingleOrDefaultAsync(i => i.ItemKey == itemKey);
            if (item == null)
            {
                throw new ItemNotFoundException($"Word item with item key {itemKey} is not found");
            }

            return item;
        }

        public async Task<WordItem> AddWordItemAsync(AddWordItemParams ps)
        {
            var item = _mapper.Map<WordItem>(ps);

            await _context.WordItems.AddAsync(item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task<WordItem> UpdateWordItemAsync(UpdateWordItemParams ps)
        {
            var item = await GetWordItemAsync(ps.ItemKey);

            _context.WordItems.Attach(item);

            _mapper.Map(ps, item);

            await _context.SaveChangesAsync();

            return item;
        }

        public async Task DeleteWordItemAsync(string itemKey)
        {
            _context.WordItems.Remove(await GetWordItemAsync(itemKey));

            await _context.SaveChangesAsync();
        }

        public async Task<string> EvalWordItemAsync(string itemKey, string language)
        {
            var item = await _context.WordInfos.SingleOrDefaultAsync(
                w => w.ItemKey == itemKey && w.Language == language);
            return item.Word ?? "";
        }

        public async Task<Dictionary<string, string>> EvalWordItemsAsync(List<string> itemKeys, string language)
        {
            var dict = await _context.WordInfos.Where(w => itemKeys.Contains(w.ItemKey) && w.Language == language)
                .ToDictionaryAsync(w => w.ItemKey, w => w.Word);

            foreach (var itemKey in itemKeys)
            {
                if (!dict.ContainsKey(itemKey))
                {
                    dict.Add(itemKey, "");
                }
            }

            return dict;
        }
    }
}