using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SStringDict: SData
    {
        public Dictionary<string, string> Inner { get; set; }

        public SStringDict(Dictionary<string, string> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}