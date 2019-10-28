using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Scalpay.Enums;

namespace Scalpay.Models.SExpressions
{
    [Serializable]
    public class SNumberList: SData
    {
        public List<double> Inner { get; set; }

        public SNumberList(List<double> inner)
        {
            Inner = inner;
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("dataType", SDataType.NumberList);
            info.AddValue("data", Inner);
        }
    }
}