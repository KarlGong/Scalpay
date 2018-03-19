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

        // todo: https://github.com/aspnet/EntityFrameworkCore/issues/242
        public ItemMode Mode { get; set; }

        // todo: https://github.com/aspnet/EntityFrameworkCore/issues/242
        public List<ParameterInfo> ParameterInfos
        {
            get
            {
                return ParameterInfosString == null
                    ? new List<ParameterInfo>()
                    : JsonConvert.DeserializeObject<List<ParameterInfo>>(ParameterInfosString);
            }

            set
            {
                ParameterInfosString = value == null
                    ? JsonConvert.SerializeObject(new List<ParameterInfo>())
                    : JsonConvert.SerializeObject(value);
            }
        }

        public string ParameterInfosString { get; set; }

        public SDataType ResultDataType { get; set; }

        public SExpression DefaultResult
        {
            get { return JsonConvert.DeserializeObject<SExpression>(DefaultResultString); }

            set { DefaultResultString = JsonConvert.SerializeObject(value); }
        }

        public string DefaultResultString { get; set; }
        
        public string ProjectKey { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}