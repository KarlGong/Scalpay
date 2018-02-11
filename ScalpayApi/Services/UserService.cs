using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class UserCriteria : Criteria<User>
    {
        public string ApiKey { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public override Expression<Func<User, bool>> ToWherePredicate()
        {
            return u =>
                (ApiKey == null || ApiKey == u.ApiKey)
                && (Username == null || Username == u.Username)
                && (Password == null || Password == u.Password);
        }
    }

    public class AddUserParams
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public List<Privilege> Privileges { get; set; }
    }

    public class UpdateUserParams
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public List<Privilege> Privileges { get; set; }
    }

    public interface IUserService
    {
        Task<User> GetUserAsync(UserCriteria criteria);

        Task<User> GetUserAsync(string username);

        Task<List<User>> GetUsersAsync(UserCriteria criteria);

        Task<List<User>> GetUsersAsync();

        Task<User> GenerateNewApiKeyAsync(User user);

        Task<User> AddUserAsync(AddUserParams ps);

        Task<User> UpdateUserAsync(UpdateUserParams ps);

        Task DeleteUserAsync(string username);
    }

    public class UserService : IUserService
    {
        private readonly ScalpayDbContext _context;

        private readonly IMapper _mapper;

        public UserService(ScalpayDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<User> GetUserAsync(UserCriteria criteria)
        {
            return await _context.Users.SingleOrDefaultAsync(criteria.ToWherePredicate());
        }

        public async Task<User> GetUserAsync(string username)
        {
            return await GetUserAsync(new UserCriteria()
            {
                Username = username
            });
        }

        public async Task<List<User>> GetUsersAsync(UserCriteria criteria)
        {
            return await _context.Users.Where(criteria.ToWherePredicate()).ToListAsync();
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GenerateNewApiKeyAsync(User user)
        {
            user.ApiKey = Guid.NewGuid().ToString();

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> AddUserAsync(AddUserParams ps)
        {
            var user = _mapper.Map<User>(ps);

            user.ApiKey = Guid.NewGuid().ToString();

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(UpdateUserParams ps)
        {
            var user = await GetUserAsync(ps.Username);

            _mapper.Map(user, ps);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task DeleteUserAsync(string username)
        {
            _context.Users.Remove(await GetUserAsync(username));

            await _context.SaveChangesAsync();
        }
    }
}