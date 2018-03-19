using System;
using System.Collections.Generic;

namespace ScalpayApi.Models
{
    public class Project
    {
        public int Id { get; set; }
        
        public string ProjectKey { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public int Version { get; set; }
        
        public bool IsLatest { get; set; }
        
        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
    }
}