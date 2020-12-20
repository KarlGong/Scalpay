using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SString: SData
    {
        public string Value { get; set; }

        public SString(string value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.String);
            info.AddValue("value", Value);
        }
    }
}