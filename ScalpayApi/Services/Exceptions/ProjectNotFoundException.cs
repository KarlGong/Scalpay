namespace ScalpayApi.Services.Exceptions
{
    public class ProjectNotFoundException : ScalpayException
    {
        public ProjectNotFoundException(string message) : base(StatusCode.ProjectNotFound, message)
        {
        }
    }
}