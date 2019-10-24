using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class Item
    {
        public int Id { get; set; }
        
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public int Version { get; set; }
        
        public bool IsLatest { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public ItemMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }

        public SExpression DefaultResult { get; set; }

        public string ProjectKey { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}