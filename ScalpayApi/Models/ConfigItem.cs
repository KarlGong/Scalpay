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
            get { return JsonConvert.DeserializeObject<List<ParameterInfo>>(ParameterInfosString); }

            set { ParameterInfosString = JsonConvert.SerializeObject(value); }
        }

        public string ParameterInfosString { get; set; }

        public SDataType ResultDataType { get; set; }

        public List<Rule> Rules { get; set; }
    }
}