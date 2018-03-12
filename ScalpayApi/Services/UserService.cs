using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ScalpayApi.Data;
using ScalpayApi.Models;
using ScalpayApi.Services.Exceptions;
using ScalpayApi.Services.Parameters;
using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services
{
    public interface IUserService
    {
        Task<User> GetUserByUsernameAsync(string username);

        Task<User> GetUserByUsernamePasswordAsync(string username, string password);

        Task<User> GetUserByApiKeyAsync(string apiKey);

        Task<List<User>> GetUsersAsync(UserCriteria criteria);

        Task<int> GetUsersCountAsync(UserCriteria criteria);

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

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            var user = await _context.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                throw new ScalpayException(StatusCode.UserNotFound, $"User with username {username} is not found.");
            }

            return user;
        }

        public async Task<User> GetUserByUsernamePasswordAsync(string username, string password)
        {
            var user = await _context.Users.AsNoTracking()
                .SingleOrDefaultAsync(u => u.Username == username && u.Password == password);
            if (user == null)
            {
                throw new ScalpayException(StatusCode.IncorrectUsernameOrPassword, "The username or password is incorrect.");
            }

            return user;
        }

        public async Task<User> GetUserByApiKeyAsync(string apiKey)
        {
            var user = await _context.Users.AsNoTracking().SingleOrDefaultAsync(u => u.ApiKey == apiKey);
            if (user == null)
            {
                throw new ScalpayException(StatusCode.UserNotFound, $"User with api key {apiKey} is not found.");
            }

            return user;
        }

        public async Task<List<User>> GetUsersAsync(UserCriteria criteria)
        {
            return await _context.Users.AsNoTracking().WithCriteria(criteria).ToListAsync();
        }

        public async Task<int> GetUsersCountAsync(UserCriteria criteria)
        {
            return await _context.Users.AsNoTracking().CountAsync(criteria);
        }

        public async Task<User> AddUserAsync(AddUserParams ps)
        {
            var oldUser = await _context.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Username == ps.Username);

            if (oldUser != null)
            {
                throw new ScalpayException(StatusCode.UserExisted, $"User with username {ps.Username} is already existed.");
            }

            var user = _mapper.Map<User>(ps);

            user.Password = "1";

            user.ApiKey = Guid.NewGuid().ToString();

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(UpdateUserParams ps)
        {
            var user = await GetUserByUsernameAsync(ps.Username);

            _context.Users.Attach(user);

            _mapper.Map(ps, user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task DeleteUserAsync(string username)
        {
            _context.Users.Remove(await GetUserByUsernameAsync(username));

            await _context.SaveChangesAsync();
        }
    }
}