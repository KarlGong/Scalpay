using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SString: SData
    {
        public string Inner { get; set; }

        public SString(string inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}