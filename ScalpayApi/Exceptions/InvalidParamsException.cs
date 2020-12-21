using System;

namespace Scalpay.Exceptions
{
    public class InvalidParamsException : ScalpayException
    {
        public InvalidParamsException(string message) : base(message)
        {
        }
        
        public InvalidParamsException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}