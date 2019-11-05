using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SDateTime: SData
    {
        public DateTime Inner { get; set; }

        public SDateTime(DateTime inner)
        {
            Inner = inner.ToUniversalTime();
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.DateTime);
            info.AddValue("data", Inner);
        }
    }
}