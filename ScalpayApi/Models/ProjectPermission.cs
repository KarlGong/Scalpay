using System;
using Scalpay.Enums;

namespace Scalpay.Models
{
    public class ProjectPermission
    {
        public int Id { get; set; }
        
        public string Username { get; set; }
        
        public string ProjectKey { get; set; }
        
        public Permission Permission { get; set; }
        
        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
    }
}    