using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SBool : SData
    {
        public bool Value { get; set; }

        public SBool(bool value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.Bool);
            info.AddValue("value", Value);
        }
    }
}