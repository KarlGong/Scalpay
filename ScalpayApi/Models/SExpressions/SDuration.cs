using System;
using System.Runtime.Serialization;
using System.Xml;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SDuration: SData
    {
        public TimeSpan Value { get; set; }

        public SDuration(string value)
        {
            Value = XmlConvert.ToTimeSpan(value);
        }

        public SDuration(TimeSpan value)
        {
            Value = value;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("type", SDataType.Duration);
            info.AddValue("value", XmlConvert.ToString(Value));
        }
    }
}