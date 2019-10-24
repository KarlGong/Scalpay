using System.Collections.Generic;
using Scalpay.Enums;

namespace Scalpay.Controllers.DTOs
{
    public class UserDTO
    {
        public string Username { get; set; }
        
        public string Email { get; set; }

        public string FullName { get; set; }

        public string ApiKey { get; set; }
        
        public List<Privilege> Privileges { get; set; }
    }
}