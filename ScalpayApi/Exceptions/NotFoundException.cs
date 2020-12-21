using System;

namespace Scalpay.Exceptions
{
    public class NotFoundException : ScalpayException
    {
        public NotFoundException(string message) : base(message)
        {
        }
        
        public NotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}