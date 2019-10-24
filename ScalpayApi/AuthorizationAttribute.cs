using System;
using System.Collections.Generic;
using System.Linq;
using Scalpay.Enums;

namespace Scalpay
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