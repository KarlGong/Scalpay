﻿using System;
using System.Runtime.Serialization;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.SExpressions
{
    [Serializable]
    public class SNumber: SData
    {
        public double Inner { get; set; }
        
        public SNumber(double inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.Number);
            info.AddValue("data", Inner);
        }
    }
}