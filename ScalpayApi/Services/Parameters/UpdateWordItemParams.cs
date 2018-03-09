using System.Collections.Generic;

namespace ScalpayApi.Services.Parameters
{
    public class UpdateWordItemParams
    {
        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public List<WordInfo> WordInfos { get; set; }
    }
}