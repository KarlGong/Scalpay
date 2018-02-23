using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ScalpayApi.Controllers.DTOs;
using ScalpayApi.Core;
using ScalpayApi.Enums;
using ScalpayApi.Models;
using ScalpayApi.Services;

namespace ScalpayApi.Controllers
{
    [Route("api/test")]
    public class TestController : Controller
    {
        private readonly IUserService _service;
        private readonly IMapper _mapper;

        public TestController(IUserService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpPost]
        public void GetUsers([FromBody] string a)
        {
            var inputVariable = Expression.Variable(typeof(SNumber), "input");

            var block = Expression.Block(new[] {inputVariable},
                Expression.Assign(inputVariable, Expression.Constant(new SNumber(1234))),
                new ExpressionParser(JObject.Parse(a), inputVariable).Parse());

            var b = Expression.Lambda<Func<SBool>>(block).Compile()();
            Console.Write(b);
        }
    }
}