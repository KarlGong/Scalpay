using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SBool : SData
    {
        public bool Inner { get; set; }

        public SBool(bool inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}