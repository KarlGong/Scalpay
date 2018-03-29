using System;
using System.Collections.Generic;
using System.Linq;
using ScalpayApi.Enums;

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