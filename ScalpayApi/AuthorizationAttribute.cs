using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi
{
    public class AuthorizationAttribute : Attribute
    {
        public List<Privilege> Privileges { get; set; }

        public AuthorizationAttribute(params Privilege[] privileges)
        {
            Privileges = privileges.ToList();
        }
    }
}