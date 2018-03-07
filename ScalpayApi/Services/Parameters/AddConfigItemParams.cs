using System.Collections.Generic;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.Parameters
{
    public class AddConfigItemParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ConfigItemMode Mode { get; set; }

        public List<ParameterInfo> ParameterInfos { get; set; }

        public SDataType ResultDataType { get; set; }
        
        public SExpression DefaultResult { get; set; }

        public List<Rule> Rules { get; set; }
    }
}