﻿using System.Collections.Generic;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SStringDict: SData
    {
        public Dictionary<string, string> Inner { get; set; }

        public SStringDict(Dictionary<string, string> inner)
        {
            Inner = inner;
        }
    }
}