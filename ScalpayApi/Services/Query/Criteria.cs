using System;
using System.Linq.Expressions;

namespace Scalpay.Services.Query
{
    public abstract class Criteria<T>
    {
        public abstract Expression<Func<T, bool>> ToWherePredicate();

        public int? PageIndex { get; set; }

        public int? PageSize { get; set; }

        public string OrderBy { get; set; }

        public OrderingDirection Direction { get; set; } = OrderingDirection.Asc;
    }
}