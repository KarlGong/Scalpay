using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Services.Parameters.Criterias;

namespace System.Linq
{
    public static class QueryableExtension
    {
        public static IQueryable<T> WithCriteria<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return queryable.Where(criteria.ToWherePredicate()).Skip(criteria.PageIndex * criteria.PageSize)
                .Take(criteria.PageSize);
        }

        public static async Task<int> CountAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.CountAsync(criteria.ToWherePredicate());
        }

        public static async Task<T> SingleAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.SingleAsync(criteria.ToWherePredicate());
        }

        public static async Task<T> SingleOrDefaultAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.SingleOrDefaultAsync(criteria.ToWherePredicate());
        }

        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string memberPath)
        {
            return source.OrderByMemberUsing(memberPath, "OrderBy");
        }

        public static IOrderedQueryable<T> OrderByDescending<T>(this IQueryable<T> source, string memberPath)
        {
            return source.OrderByMemberUsing(memberPath, "OrderByDescending");
        }

        public static IOrderedQueryable<T> ThenBy<T>(this IOrderedQueryable<T> source, string memberPath)
        {
            return source.OrderByMemberUsing(memberPath, "ThenBy");
        }

        public static IOrderedQueryable<T> ThenByDescending<T>(this IOrderedQueryable<T> source, string memberPath)
        {
            return source.OrderByMemberUsing(memberPath, "ThenByDescending");
        }

        private static IOrderedQueryable<T> OrderByMemberUsing<T>(this IQueryable<T> source, string memberPath,
            string method)
        {
            var parameter = Expression.Parameter(typeof(T), "item");
            var member = memberPath.Split('.')
                .Aggregate((Expression) parameter, Expression.PropertyOrField);
            var keySelector = Expression.Lambda(member, parameter);
            var methodCall = Expression.Call(
                typeof(Queryable), method, new[] {parameter.Type, member.Type},
                source.Expression, Expression.Quote(keySelector));
            return (IOrderedQueryable<T>) source.Provider.CreateQuery(methodCall);
        }
    }
}