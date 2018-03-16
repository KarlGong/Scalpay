using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class User
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public string ApiKey { get; set; }

        public List<Privilege> Privileges // todo: https://github.com/aspnet/EntityFrameworkCore/issues/242
        {
            get
            {
                return Enum.GetValues(typeof(Privilege)).Cast<Privilege>().Where(
                    p => (PrivilegesInt & (int) p) != 0).ToList();
            }
            set { PrivilegesInt = value.Sum(p => (int) p); }
        }

        public int PrivilegesInt { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
        
        public List<Audit> Audits { get; set; } = new List<Audit>();
    }
}