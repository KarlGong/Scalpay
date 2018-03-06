﻿using System;
using System.Runtime.Serialization;
using System.Xml;

namespace ScalpayApi.Services.SExpressions
{
    public class SDuration: SData
    {
        public TimeSpan Inner { get; set; }

        public SDuration(string inner)
        {
            Inner = XmlConvert.ToTimeSpan(inner);
        }

        public SDuration(TimeSpan inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("data", XmlConvert.ToString(Inner));
        }
    }
}