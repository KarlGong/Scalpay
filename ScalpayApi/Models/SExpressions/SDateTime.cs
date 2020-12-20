using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SDateTime: SData
    {
        public DateTime Value { get; set; }

        public SDateTime(DateTime value)
        {
            Value = value.ToUniversalTime();
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.DateTime);
            info.AddValue("value", Value);
        }
    }
}