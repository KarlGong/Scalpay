using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Scalpay.Enums;
using Scalpay.Models.SExpressions;

namespace Scalpay.Models
{
    public class Item
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
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