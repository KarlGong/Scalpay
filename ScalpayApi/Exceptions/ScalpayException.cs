using System;

namespace ScalpayApi.Exceptions
{
    public class ScalpayException: Exception
    {
        public ScalpayException(string message) : base(message)
        {
            
        }
    }
}