using System;
using ScalpayApi.Enums;

namespace ScalpayApi.Services.Exceptions
{
    public class ScalpayException: Exception
    {
        public StatusCode StatusCode { get; set; }
        
        public ScalpayException(StatusCode code, string message): base(message)
        {
            StatusCode = code;
        }
        
        public ScalpayException(StatusCode code, string message, Exception innerException): base(message, innerException)
        {
            StatusCode = code;
        }
    }
}