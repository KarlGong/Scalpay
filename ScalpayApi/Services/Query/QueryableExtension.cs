using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Scalpay.Exceptions;

namespace Scalpay.Services.Query
{
    public static class QueryableExtension
    {
        public static IQueryable<T> WithCriteria<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            if (!string.IsNullOrEmpty(criteria.OrderBy))
            {
                queryable = queryable.OrderByMemberUsing(criteria.OrderBy,
                    criteria.Direction.Equals(OrderingDirection.Asc) ? "OrderBy" : "OrderByDescending");
            }

            return queryable.Where(criteria.ToWherePredicate()).Skip(criteria.PageIndex * criteria.PageSize).Take(criteria.PageSize);
        }

        public static Task<int> CountAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return queryable.CountAsync(criteria.ToWherePredicate());
        }

        public static Task<T> FirstOrDefaultAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return queryable.FirstOrDefaultAsync(criteria.ToWherePredicate());
        }

        private static IOrderedQueryable<T> OrderByMemberUsing<T>(this IQueryable<T> source, string memberPath, string method)
        {
            try
            {
                var parameter = Expression.Parameter(typeof(T), "item");
                var member = memberPath.Split('.').Aggregate((Expression) parameter, Expression.PropertyOrField);
                var keySelector = Expression.Lambda(member, parameter);
                var methodCall = Expression.Call(typeof(Queryable), method, new[] {parameter.Type, member.Type}, source.Expression, Expression.Quote(keySelector));
                return (IOrderedQueryable<T>) source.Provider.CreateQuery(methodCall);
            }
            catch (ArgumentException ex)
            {
                throw new InvalidParamsException(ex.Message, ex);
            }
        }
    }
}