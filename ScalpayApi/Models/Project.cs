using System;
using System.Collections.Generic;

namespace ScalpayApi.Models
{
    public class Project
    {
        public int Id { get; set; }

        public string Key { get; set; }

        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public string URL { get; set; }
        
//        public string Avatar { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime InsertTime { get; set; }
        
        public DateTime UpdateTime { get; set; }
    }
}