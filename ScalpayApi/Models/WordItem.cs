using System.Collections.Generic;
using ScalpayApi.Enums;

namespace ScalpayApi.Models
{
    public class WordItem : Item
    {
        public override ItemType Type
        {
            get { return ItemType.Word; }
        }
        
        public List<WordInfo> WordInfos { get; set; }= new List<WordInfo>();
    }
}