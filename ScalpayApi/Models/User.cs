
using System;
using System.Collections.Generic;

namespace ScalpayApi.Models
{
    public class User
    {
        public int Id { get; set; }
        
        public string UserName { get; set; }
        
        public string Password { get; set; }
        
        public string FullName { get; set; }
        
        public string Email { get; set; }
        
        public string Avatar { get; set; }

        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
    }
}