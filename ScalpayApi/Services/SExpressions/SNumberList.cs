using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SNumberList: SData
    {
        public List<double> Inner { get; set; }

        public SNumberList(List<double> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}