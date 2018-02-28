﻿using System;
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

        public ItemType Type { get; set; }

        public ItemMode? Mode { get; set; }

        public List<ParameterInfo> ParameterInfos
        {
            get { return JsonConvert.DeserializeObject<List<ParameterInfo>>(ParameterInfosString); }

            set { ParameterInfosString = JsonConvert.SerializeObject(value); }
        }

        public string ParameterInfosString { get; set; }

        public SDataType ResultDataType { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public string ProjectKey { get; set; }

        public Project Project { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}