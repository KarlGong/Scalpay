using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Scalpay.Data;
using Scalpay.Enums;
using Scalpay.Exceptions;
using Scalpay.Models;
using Scalpay.Services.Query;

namespace Scalpay.Services
{
    public class UserCriteria : Criteria<User>
    {
        public string Keyword { get; set; }

        public override Expression<Func<User, bool>> ToWherePredicate()
        {
            return u => (Keyword == null
                            || u.Username.Contains(Keyword)
                            || u.FullName.Contains(Keyword)
                            || u.Email.Contains(Keyword));
        }
    }
    
    public class UpsertUserParams
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }
        
        public string Password { get; set; }

        public Role Role { get; set; }
    }

    public interface IUserService
    {
        Task<User> GetUserAsync(string username);

        Task<User> GetUserByUsernameAndPasswordAsync(string username, string password);
        
        Task<User> GetCachedUserAsync(string username);

        Task<User> GetCurrentUserAsync();
        
        Task<QueryResults<User>> GetUsersAsync(UserCriteria criteria);

        Task<User> AddUserAsync(UpsertUserParams ps);

        Task<User> UpdateUserAsync(UpsertUserParams ps);
    }

    public class UserService : IUserService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private readonly IHttpContextAccessor _accessor;

        public UserService(ScalpayDbContext context, IMapper mapper, IMemoryCache cache, IHttpContextAccessor accessor)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
            _accessor = accessor;
        }

        public async Task<User> GetUserAsync(string username)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                throw new NotFoundException($"User {username} doesn't exist.");
            }

            return user;
        }

        public async Task<User> GetUserByUsernameAndPasswordAsync(string username, string password)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
            if (user == null)
            {
                throw new NotFoundException($"User with username {username} & password {password} doesn't exist.");
            }

            return user;
        }

        public async Task<User> GetCachedUserAsync(string username)
        {
            return await _cache.GetOrCreateAsync($"user-{username}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetUserAsync(username);
            });
        }

        public async Task<User> GetCurrentUserAsync()
        {
            var username = _accessor.HttpContext.User?.FindFirstValue("username");
            if (username == null) throw new NotFoundException("Cannot find username in http context.");

            return await this.GetCachedUserAsync(username);
        }

        public async Task<QueryResults<User>> GetUsersAsync(UserCriteria criteria)
        {
            return new QueryResults<User>()
            {
                Value = await _context.Users.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Users.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<User> AddUserAsync(UpsertUserParams ps)
        {
            if (await _context.Users.AsNoTracking().AnyAsync(u => u.Username == ps.Username))
            {
                throw new ConflictException($"User with username {ps.Username} is already existing.");
            }
            
            // verification
            if (await _context.Users.AsNoTracking().AnyAsync(u => u.Email == ps.Email))
            {
                throw new ConflictException($"User with email {ps.Email} is already existing.");
            }

            var user = _mapper.Map<User>(ps);
            user.Password ??= "1"; // todo: use item in __scalpay

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(UpsertUserParams ps)
        {
            _cache.Remove($"user-{ps.Username}");
            
            var oldUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == ps.Username);
            if (oldUser == null)
            {
                throw new NotFoundException($"The user {ps.Username} cannot be found.");
            }
            
            // verification
            if (!oldUser.Email.RoughEquals(ps.Email) && await _context.Users.AsNoTracking().AnyAsync(u => u.Email == ps.Email))
            {
                throw new ConflictException($"User with email {ps.Email} is already existing.");
            }

            _mapper.Map(ps, oldUser);

            await _context.SaveChangesAsync();
            
            return oldUser;
        }
    }
}