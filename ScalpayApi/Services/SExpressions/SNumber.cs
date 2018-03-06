using System.Runtime.Serialization;

namespace ScalpayApi.Services.SExpressions
{
    public class SNumber: SData
    {
        public double Inner { get; set; }
        
        public SNumber(double inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", Inner);
        }
    }
}