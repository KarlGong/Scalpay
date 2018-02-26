using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class Item
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ItemType Type { get; set; }

        public ConfigMode? ConfigMode { get; set; }

        public JToken ParamDataType
        {
            get { return JToken.Parse(ParamDataTypeString); }
            
            set { ParamDataTypeString = value.ToString(); }
        }

        public string ParamDataTypeString { get; set; }

        public JToken ResultDataType
        {
            get { return JToken.Parse(ResultDataTypeString); }

            set { ResultDataTypeString = value.ToString(); }
        }

        public string ResultDataTypeString { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public string ProjectKey { get; set; }

        public Project Project { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}