namespace ScalpayApi.Services.Exceptions
{
    public enum StatusCode
    {
        ItemNotFound = 200,
        ItemExisted = 201,
        
        EvalItemError = 250,
        
        ProjectNotFound = 300,
        ProjectExisted = 301,
        
        UserNotFound = 400,
        UserExisted = 401,
        IncorrectPassword = 402,
    }
}