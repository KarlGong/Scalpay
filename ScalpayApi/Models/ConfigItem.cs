using System.Collections.Generic;
using Newtonsoft.Json;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class ConfigItem : Item
    {
        public override ItemType Type
        {
            get { return ItemType.Config; }
        }

        // todo: https://github.com/aspnet/EntityFrameworkCore/issues/242
        public ConfigItemMode Mode { get; set; }

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

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}