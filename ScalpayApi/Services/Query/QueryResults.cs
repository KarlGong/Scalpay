using System.Collections.Generic;

namespace Scalpay.Services.Query
{
    public class QueryResults<T>
    {
        public List<T> Value { get; set; }
        
        public int TotalCount { get; set; }
    }
}