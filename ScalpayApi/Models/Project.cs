using System;
using System.Collections.Generic;

namespace ScalpayApi.Models
{
    public class Project
    {
        public string ProjectKey { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
        
        public List<Item> Items { get; set; } = new List<Item>();
        
        public List<Audit> Audits { get; set; } = new List<Audit>();
    }
}