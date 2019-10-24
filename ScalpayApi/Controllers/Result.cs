namespace Scalpay.Controllers
{
    public class Result<T>: Result
    {
        public T Data { get; set; }
    }

    public class Result
    {
        public int? StatusCode { get; set; }
        
        public string Message { get; set; }
        
        public int? TotalCount { get; set; }
    }
}