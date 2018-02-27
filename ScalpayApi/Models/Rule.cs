using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ScalpayApi.Models
{
    public class Rule
    {
        public int Id { get; set; }

        public string ItemKey { get; set; }

        public Item Item { get; set; }

        public SExpression Condition // null means default rule
        {
            get { return JsonConvert.DeserializeObject<SExpression>(ConditionString); }

            set { ConditionString = JsonConvert.SerializeObject(value); }
        }

        public string ConditionString { get; set; }

        public SExpression Result
        {
            get { return JsonConvert.DeserializeObject<SExpression>(ResultString); }
            
            set { ResultString = JsonConvert.SerializeObject(value); }
        }

        public string ResultString { get; set; }

        public int Order { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}