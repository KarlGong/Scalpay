using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services
{
    public class UserCriteria
    {
        public string ApiKey { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }
    }

    public class AddUserParams
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }
        
        public List<Privilege> Privileges { get; set; }
    }

    public class UpdateUserParams
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }

        public List<Privilege> Privileges { get; set; }
    }

    public interface IUserService
    {
        Task<User> GetUserAsync(UserCriteria criteria);

        Task<User> GetUserAsync(string userName);

        Task<List<User>> GetUsersAsync(UserCriteria criteria);
        
        Task<List<User>> GetUsersAsync();

        Task<User> GenerateNewApiKeyAsync(User user);

        Task<User> AddUserAsync(AddUserParams ps);

        Task<User> UpdateUserAsync(UpdateUserParams ps);

        Task DeleteUserAsync(string userName);
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
            return await _context.Users.SingleOrDefaultAsync(u =>
                (criteria.ApiKey == null || criteria.ApiKey == u.ApiKey)
                && (criteria.UserName == null || criteria.UserName == u.UserName)
                && (criteria.Password == null || criteria.Password == u.Password));
        }

        public async Task<User> GetUserAsync(string userName)
        {
            return await GetUserAsync(new UserCriteria()
            {
                UserName = userName
            });
        }

        public async Task<List<User>> GetUsersAsync(UserCriteria criteria)
        {
            return await _context.Users.Where(u =>
                (criteria.ApiKey == null || criteria.ApiKey == u.ApiKey)
                && (criteria.UserName == null || criteria.UserName == u.UserName)
                && (criteria.Password == null || criteria.Password == u.Password)).ToListAsync();
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
            var user = await GetUserAsync(ps.UserName);

            _mapper.Map(user, ps);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task DeleteUserAsync(string userName)
        {
            _context.Users.Remove(await GetUserAsync(userName));

            await _context.SaveChangesAsync();
        }
    }
}