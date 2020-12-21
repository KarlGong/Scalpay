using System;

namespace Scalpay.Exceptions
{
    public class ConflictException : ScalpayException
    {
        public ConflictException(string message) : base(message)
        {
        }
        
        public ConflictException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}