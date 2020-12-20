using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SStringList: SData
    {
        public List<string> Value { get; set; }

        public SStringList(List<string> value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.StringList);
            info.AddValue("value", Value);
        }
    }
}