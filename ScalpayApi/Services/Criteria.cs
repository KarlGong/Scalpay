using System;
using System.Linq.Expressions;

namespace ScalpayApi.Services
{
    public abstract class Criteria<T>
    {
        public abstract Expression<Func<T, bool>> ToWherePredicate();
    }
}