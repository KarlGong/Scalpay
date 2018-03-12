namespace ScalpayApi.Services.Exceptions
{
    public class ItemNotFoundException : ScalpayException
    {
        public ItemNotFoundException(string message) : base(StatusCode.ItemNotFound, message)
        {
        }
    }
}