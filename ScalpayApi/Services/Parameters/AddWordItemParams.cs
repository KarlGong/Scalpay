using System.Collections.Generic;

namespace ScalpayApi.Services.Parameters
{
    public class AddWordItemParams
    {
        public string ProjectKey { get; set; }

        public string ItemKey { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public List<WordInfo> WordInfos { get; set; }
    }
}