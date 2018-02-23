using System;

namespace ScalpayApi.Core
{
    public class SDateTime: SData
    {
        public DateTimeOffset Inner { get; set; }

        public SDateTime(string inner)
        {
            Inner = DateTimeOffset.Parse(inner);
        }

    }
}