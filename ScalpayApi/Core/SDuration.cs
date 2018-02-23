using System;

namespace ScalpayApi.Core
{
    public class SDuration: SData
    {
        public TimeSpan Inner { get; set; }

        public SDuration(string inner)
        {
            Inner = TimeSpan.Parse(inner);
        }

    }
}