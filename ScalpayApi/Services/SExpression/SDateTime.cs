using System;

namespace ScalpayApi.Services.SExpression
{
    public class SDateTime: SData
    {
        public DateTimeOffset Inner { get; set; }

        public SDateTime(string inner)
        {
            Inner = DateTimeOffset.Parse(inner).ToUniversalTime();
        }

        public SDateTime(DateTimeOffset inner)
        {
            Inner = inner.ToUniversalTime();
        }
    }
}