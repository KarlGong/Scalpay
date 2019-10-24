using System.Collections.Generic;
using Scalpay.Enums;

namespace Scalpay.Services.Parameters
{
    public class UpdateItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ItemMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; } = new List<ParameterInfo>();

        public SDataType ResultDataType { get; set; }
        
        public SExpression DefaultResult { get; set; }

        public List<Rule> Rules { get; set; } = new List<Rule>();
    }
}