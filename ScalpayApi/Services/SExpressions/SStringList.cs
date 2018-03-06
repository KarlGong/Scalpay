using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SStringList: SData
    {
        public List<string> Inner { get; set; }

        public SStringList(List<string> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}