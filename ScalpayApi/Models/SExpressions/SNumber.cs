using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SNumber: SData
    {
        public double Value { get; set; }
        
        public SNumber(double value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.Number);
            info.AddValue("value", Value);
        }
    }
}