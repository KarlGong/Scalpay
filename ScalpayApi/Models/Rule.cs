using System;

namespace ScalpayApi.Models
{
    public class Rule
    {
        public int Id { get; set; }
        
        public string ItemKey { get; set; }
        
        public Item Item { get; set; }
        
        public string ConditionString { get; set; }
        
        public string ResultString { get; set; }
        
        public int Order { get; set; }
        
        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}