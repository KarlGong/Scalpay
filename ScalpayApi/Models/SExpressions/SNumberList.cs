using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SNumberList: SData
    {
        public List<double> Value { get; set; }

        public SNumberList(List<double> value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.NumberList);
            info.AddValue("value", Value);
        }
    }
}