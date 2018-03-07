using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.SExpressions
{
    [Serializable]
    public class SStringDict: SData
    {
        public Dictionary<string, string> Inner { get; set; }

        public SStringDict(Dictionary<string, string> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.StringDict);
            info.AddValue("data", Inner);
        }
    }
}