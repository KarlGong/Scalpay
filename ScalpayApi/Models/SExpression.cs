using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class SExpression
    {
        public SDataType ReturnType { get; set; }
        
        public SExpressionType ExpType { get; set; }
        
        // Func
        public string FuncName { get; set; }
        
        public List<SExpression> FuncArgs { get; set; } = new List<SExpression>();
        
        // Value
        public JToken Value { get; set; }
        
        // Var
        public string Var { get; set; } 
    }
}