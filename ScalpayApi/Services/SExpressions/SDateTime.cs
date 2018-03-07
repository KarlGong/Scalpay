using System;
using System.Runtime.Serialization;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.SExpressions
{
    [Serializable]
    public class SDateTime: SData
    {
        public DateTimeOffset Inner { get; set; }

        public SDateTime(string inner)
        {
            Inner = DateTimeOffset.Parse(inner).ToUniversalTime();
        }

        public SDateTime(DateTimeOffset inner)
        {
            Inner = inner.ToUniversalTime();
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.DateTime);
            info.AddValue("data", Inner.ToString("yyyy-MM-ddTHH:mm:ssZ"));
        }
    }
}