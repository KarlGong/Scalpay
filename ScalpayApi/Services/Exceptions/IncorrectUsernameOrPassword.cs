namespace ScalpayApi.Services.Exceptions
{
    public class IncorrectUsernameOrPassword : ScalpayException
    {
        public IncorrectUsernameOrPassword(string message) : base(StatusCode.IncorrectUsernameOrPassword, message)
        {
        }
    }
}