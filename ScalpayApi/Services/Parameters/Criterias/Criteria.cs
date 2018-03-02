using System;
using System.Linq.Expressions;

namespace ScalpayApi.Services.Parameters.Criterias
{
    public abstract class Criteria<T>
    {
        public abstract Expression<Func<T, bool>> ToWherePredicate();
    }
}