using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SStringDict: SData
    {
        public Dictionary<string, string> Value { get; set; }

        public SStringDict(Dictionary<string, string> value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.StringDict);
            info.AddValue("value", Value);
        }
    }
}