using System;
using Scalpay.Enums;

namespace Scalpay.Models
{
    public class Permission
    {
        public int Id { get; set; }
        
        public string Username { get; set; }
        
        public string ProjectKey { get; set; }
        
        public Privilege Privilege { get; set; }
        
        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
    }
}