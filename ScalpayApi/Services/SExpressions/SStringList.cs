﻿using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.SExpressions
{
    [Serializable]
    public class SStringList: SData
    {
        public List<string> Inner { get; set; }

        public SStringList(List<string> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.StringList);
            info.AddValue("data", Inner);
        }
    }
}