﻿using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    public class SExpression
    {
        public SDataType ReturnType { get; set; }
        
        public SExpressionType ExpType { get; set; }
        
        // Func
        public string FuncName { get; set; }
        
        public List<SExpression> FuncArgs { get; set; }
        
        // Value
        public JToken Value { get; set; }
        
        // Var
        public string Var { get; set; } 
    }
}