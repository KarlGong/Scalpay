using System;
using System.Linq.Expressions;

namespace Scalpay.Services.Parameters.Criterias
{
    public abstract class Criteria<T>
    {
        public abstract Expression<Func<T, bool>> ToWherePredicate();

        public int PageIndex { get; set; } = 0;

        public int PageSize { get; set; } = 20;
    }
}