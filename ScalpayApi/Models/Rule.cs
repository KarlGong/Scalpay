using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Scalpay.Models.SExpressions;

namespace Scalpay.Models
{
    public class Rule
    {
        public int Id { get; set; }

        public SExpression Condition { get; set; }

        public SExpression Result { get; set; }

        public int Order { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
        
        public string ItemKey { get; set; }

        public Item Item { get; set; }
    }
}