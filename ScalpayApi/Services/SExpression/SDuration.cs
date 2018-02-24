using System;

namespace ScalpayApi.Services.SExpression
{
    public class SDuration: SData
    {
        public TimeSpan Inner { get; set; }

        public SDuration(string inner)
        {
            Inner = TimeSpan.Parse(inner);
        }

        public SDuration(TimeSpan inner)
        {
            Inner = inner;
        }

    }
}