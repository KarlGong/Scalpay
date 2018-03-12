using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Services.Parameters.Criterias;

namespace System.Linq
{
    public static class IQueryableExtension
    {
        public static IQueryable<T> Where<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return queryable.Where(item => criteria.IsMatched(item));
        }

        public static IQueryable<T> WithPaging<T>(this IQueryable<T> queryable, Pagination pagination)
        {
            return queryable.Skip(pagination.PageIndex * pagination.PageSize).Take(pagination.PageSize);
        }

        public static async Task<int> CountAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.CountAsync(item => criteria.IsMatched(item));
        }

        public static async Task<T> SingleAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.SingleAsync(item => criteria.IsMatched(item));
        }
        
        public static async Task<T> SingleOrDefaultAsync<T>(this IQueryable<T> queryable, Criteria<T> criteria)
        {
            return await queryable.SingleOrDefaultAsync(item => criteria.IsMatched(item));
        }
    }
}