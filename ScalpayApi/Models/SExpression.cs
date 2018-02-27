using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class SExpression
    {
        public SDataType Return { get; set; }
        
        public SExpressionType Type { get; set; }
        
        // Func
        public string Name { get; set; }
        
        public List<SExpression> Args { get; set; } = new List<SExpression>();
        
        // Value
        public JToken Value { get; set; }
        
        // Var
        public string Var { get; set; } 
    }
}