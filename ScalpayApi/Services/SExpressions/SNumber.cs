﻿namespace ScalpayApi.Services.SExpressions
{
    public class SNumber: SData
    {
        public double Inner { get; set; }
        
        public SNumber(double inner)
        {
            Inner = inner;
        }
    }
}