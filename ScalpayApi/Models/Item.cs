using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class Item
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public virtual ItemType Type { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public string ProjectKey { get; set; }

        public Project Project { get; set; }   
    }
}