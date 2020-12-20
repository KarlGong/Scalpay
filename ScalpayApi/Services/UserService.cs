using System;
using System.Linq;
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

namespace Scalpay.Services
{
    public class UpsertUserParams
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public Role Role { get; set; }
    }

    public interface IUserService
    {
        Task<User> GetUserAsync(int id);

        Task<User> GetUserByUsernameAndPasswordAsync(string username, string password);
        
        Task<User> GetCachedUserAsync(int id);

        Task<User> GetCurrentUserAsync();

        Task<User> AddUserAsync(UpsertUserParams ps);

        Task<User> UpdateUserAsync(int id, UpsertUserParams ps);
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

        public async Task<User> GetUserAsync(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new NotFoundException($"User {id} doesn't exist.");
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

        public async Task<User> GetCachedUserAsync(int id)
        {
            return await _cache.GetOrCreateAsync($"user-{id}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return await GetUserAsync(id);
            });
        }

        public async Task<User> GetCurrentUserAsync()
        {
            var idStr = _accessor.HttpContext.User?.FindFirstValue("id");
            if (idStr == null) throw new NotFoundException("Cannot find user id in http context.");
            if (!int.TryParse(idStr, out var id)) throw new Exception("Cannot parse user id in http context to int.");

            return await this.GetCachedUserAsync(id);
        }


        public async Task<User> AddUserAsync(UpsertUserParams ps)
        {
            if (await _context.Users.AsNoTracking().AnyAsync(u => u.Username == ps.Username))
            {
                throw new ConflictException($"User with username {ps.Username} is already existing.");
            }

            var user = _mapper.Map<User>(ps);

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(int id, UpsertUserParams ps)
        {
            _cache.Remove($"user-{id}");
            
            var oldUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == ps.Username);
            if (oldUser == null)
            {
                throw new NotFoundException($"The user {id} cannot be found.");
            }

            _mapper.Map(ps, oldUser);

            await _context.SaveChangesAsync();
            
            return oldUser;
        }
    }
}