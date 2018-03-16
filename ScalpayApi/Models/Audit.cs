using System;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class Audit
    {
        public int Id { get; set; }
        
        public AuditType AuditType { get; set; }
        
        public string ProjectKey { get; set; }
        
        public Project Project { get; set; }
         
        public string ItemKey { get; set; }
        
        public Item Item { get; set; }
        
        public string OperatorUserName { get; set; }
        
        public User Operator { get; set; }
        
        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}