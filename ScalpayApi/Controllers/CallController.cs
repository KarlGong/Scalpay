using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScalpayApi.Controllers.DTOs;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/call")]
    public class CallController : Controller
    {
        private readonly HttpContext _httpContext;
        private readonly IItemService _service;
        private readonly IMapper _mapper;

        public CallController(IHttpContextAccessor accessor, IItemService service, IMapper mapper)
        {
            _httpContext = accessor.HttpContext;
            _service = service;
            _mapper = mapper;
        }
        
        [HttpGet("config/{itemKey}")]
        public async Task<object> GetConfig([FromRoute] string itemKey, [FromQuery] string p)
        {
            return await Task.FromResult(new object());
        }
        
        [HttpGet("lookup/{itemKey}")]
        public async Task<object> GetLookup([FromRoute] string itemKey)
        {
            return await Task.FromResult(new object());
        }

        [HttpGet("word/{itemKey}/{lng}")]
        public async Task<object> GetWord([FromRoute] string itemKey, [FromRoute] string lng)
        {
            return await Task.FromResult(new object());
        }
        
        
       
    }
}