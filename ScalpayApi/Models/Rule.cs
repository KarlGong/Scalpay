using System;
using Newtonsoft.Json.Linq;

namespace ScalpayApi.Models
{
    public class Rule
    {
        public int Id { get; set; }

        public string ItemKey { get; set; }

        public Item Item { get; set; }

        public JToken Condition // null means default rule
        {
            get { return JToken.Parse(ConditionString); }

            set { ConditionString = value.ToString(); }
        }

        public string ConditionString { get; set; }

        public JToken Result
        {
            get { return JToken.Parse(ResultString); }
            
            set { ResultString = value.ToString(); }
        }

        public string ResultString { get; set; }

        public int Order { get; set; }

        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}