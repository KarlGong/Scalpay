using System;
using System.Collections.Generic;

namespace Scalpay.Models
{
    public class Project
    {
        public int Id { get; set; }
        
        public string ProjectKey { get; set; }

        public string Description { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}