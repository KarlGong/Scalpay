using System.Runtime.Serialization;

namespace Scalpay.Models.SExpressions
{
    public abstract class SData : ISerializable
    {
        public abstract void GetObjectData(SerializationInfo info, StreamingContext context);
    }
}