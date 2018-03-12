using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Services.Parameters.Criterias;

namespace System.Linq
{
    public static class IQueryableExtension
    {
        public static IQueryable<T> WithCriteria<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return queryable.Where(criteria.ToWherePredicate()).Skip(criteria.PageIndex * criteria.PageSize).Take(criteria.PageSize);
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
    }
}