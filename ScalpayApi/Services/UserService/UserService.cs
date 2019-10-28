using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Scalpay.Data;
using Scalpay.Exceptions;
using Scalpay.Models;

namespace Scalpay.Services.UserService
{
    public interface IUserService
    {
        Task<User> GetUserAsync(string username);

        Task<ListResults<User>> GetUsersAsync(UserCriteria criteria);

        Task<User> AddUserAsync(User user);

        Task<User> UpdateUserAsync(User user);
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

        public async Task<User> GetUserAsync(string username)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                throw new NotFoundException($"The user {username} cannot be found.");
            }

            return user;
        }

        public async Task<ListResults<User>> GetUsersAsync(UserCriteria criteria)
        {
            return new ListResults<User>()
            {
                Data = await _context.Users.AsNoTracking().WithCriteria(criteria).ToListAsync(),
                TotalCount = await _context.Users.AsNoTracking().CountAsync(criteria)
            };
        }

        public async Task<User> AddUserAsync(User user)
        {
            if (await _context.Users.AsNoTracking().AnyAsync(u => u.Username == user.Username))
            {
                throw new ConflictException($"User with username {user.Username} is already existing.");
            }

            user.Password = "1";
            user.InsertTime = DateTime.UtcNow;
            user.UpdateTime = DateTime.UtcNow;

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            var oldUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (oldUser == null)
            {
                throw new NotFoundException($"The user {user.Username} cannot be found.");
            }

            _mapper.Map(user, oldUser);
            oldUser.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return oldUser;
        }
    }
}