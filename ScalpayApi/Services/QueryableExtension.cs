using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Remotion.Linq.Clauses;
using Scalpay.Services;

namespace System.Linq
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

        public static async Task<int> CountAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.CountAsync(criteria.ToWherePredicate());
        }

        public static async Task<T> FirstOrDefaultAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.FirstOrDefaultAsync(criteria.ToWherePredicate());
        }

        private static IOrderedQueryable<T> OrderByMemberUsing<T>(this IQueryable<T> source, string memberPath, string method)
        {
            var parameter = Expression.Parameter(typeof(T), "item");
            var member = memberPath.Split('.').Aggregate((Expression) parameter, Expression.PropertyOrField);
            var keySelector = Expression.Lambda(member, parameter);
            var methodCall = Expression.Call(typeof(Queryable), method, new[] {parameter.Type, member.Type}, source.Expression, Expression.Quote(keySelector));
            return (IOrderedQueryable<T>) source.Provider.CreateQuery(methodCall);
        }
    }
}