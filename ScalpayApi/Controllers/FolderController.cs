using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/folders")]
    public class FolderController: Controller
    {
        private readonly IFolderService _service;

        public FolderController(IFolderService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public async Task<Folder> GetFolder([FromRoute] int id)
        {
            return await _service.GetAsync(id);
        }

        [HttpPut]
        public async Task<Folder> AddFolder(AddFolderParams ps)
        {
            return await _service.AddAsync(ps);
        }

        [HttpPost("{id}")]
        public async Task<Folder> UpdateFolder([FromRoute] int id, UpdateFolderPramas ps)
        {
            ps.Id = id;
            return await _service.UpdateAsync(ps);
        }

        [HttpDelete("{id}")]
        public async Task DeleteFolder([FromRoute] int id)
        {
            await _service.DeleteAsync(id);
        }

        [HttpGet]
        public async Task<List<Folder>> GetFolders([FromQuery] int projectId, [FromQuery] int? parentFolderId)
        {
            return await _service.GetFolders(projectId, parentFolderId);
        }
    }
}