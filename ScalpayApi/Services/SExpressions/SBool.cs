using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Services.SExpressions
{
    [Serializable]
    public class SBool : SData
    {
        public bool Inner { get; set; }

        public SBool(bool inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.Bool);
            info.AddValue("data", Inner);
        }
    }
}