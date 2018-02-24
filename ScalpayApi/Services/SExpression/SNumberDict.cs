using System.Collections.Generic;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SNumberDict : SData
    {
        public Dictionary<string, double> Inner { get; set; }

        public SNumberDict(Dictionary<string, double> inner)
        {
            Inner = inner;
        }
    }
}