using System;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Services.ExpressionService.SExpressions
{
    [Serializable]
    public class SString: SData
    {
        public string Inner { get; set; }

        public SString(string inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.String);
            info.AddValue("data", Inner);
        }
    }
}