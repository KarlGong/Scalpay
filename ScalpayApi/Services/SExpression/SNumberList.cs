using System.Collections.Generic;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SNumberList: SData
    {
        public List<double> Inner { get; set; }

        public SNumberList(List<double> inner)
        {
            Inner = inner;
        }
    }
}