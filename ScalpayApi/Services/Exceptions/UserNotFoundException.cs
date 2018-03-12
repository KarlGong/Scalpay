namespace ScalpayApi.Services.Exceptions
{
    public class UserNotFoundException : ScalpayException
    {
        public UserNotFoundException(string message) : base(StatusCode.UserNotFound, message)
        {
        }
    }
}