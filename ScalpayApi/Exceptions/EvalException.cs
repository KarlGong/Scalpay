using System;

namespace Scalpay.Exceptions
{
    public class EvalException : ScalpayException
    {
        public EvalException(string message) : base(message)
        {
        }

        public EvalException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}