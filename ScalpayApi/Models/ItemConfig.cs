using System.Collections.Generic;
using Newtonsoft.Json;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class ItemConfig : Item
    {
        public override ItemType Type
        {
            get { return ItemType.Config; }
        }

        public ItemConfigMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos
        {
            get { return JsonConvert.DeserializeObject<List<ParameterInfo>>(ParameterInfosString); }

            set { ParameterInfosString = JsonConvert.SerializeObject(value); }
        }

        public string ParameterInfosString { get; set; }

        public SDataType ResultDataType { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}