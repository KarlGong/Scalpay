using System.Collections.Generic;

namespace Scalpay.Services
{
    public class ListResults<T>
    {
        public List<T> Data { get; set; }
        
        public int TotalCount { get; set; }
    }
}