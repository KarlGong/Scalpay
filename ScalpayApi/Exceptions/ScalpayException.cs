using System;

namespace Scalpay.Exceptions
{
    public class ScalpayException : Exception
    {
        public ScalpayException(string message) : base(message)
        {
        }
        
        public ScalpayException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}