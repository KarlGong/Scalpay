﻿namespace ScalpayApi.Services.SExpression
{
    public class SBool : SData
    {
        public bool Inner { get; set; }

        public SBool(bool inner)
        {
            Inner = inner;
        }
    }
}