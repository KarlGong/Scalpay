using System;

namespace ScalpayApi.Models
{
    public class WordInfo
    {
        public int Id { get; set; }
        
        public string ItemKey { get; set; }

        public WordItem WordItem { get; set; }
        
        public string Language { get; set; }
        
        public string Word { get; set; }
        
        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}