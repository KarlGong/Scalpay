using System.Collections.Generic;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SStringList: SData
    {
        public List<string> Inner { get; set; }

        public SStringList(List<string> inner)
        {
            Inner = inner;
        }
    }
}