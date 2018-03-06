using System;
using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
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
            info.AddValue("data", Inner.ToString("o"));
        }
    }
}