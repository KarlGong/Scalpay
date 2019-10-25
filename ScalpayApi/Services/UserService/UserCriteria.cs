using System;
using System.Linq.Expressions;
using Scalpay.Models;

namespace Scalpay.Services.UserService
{
    public class UserCriteria : Criteria<User>
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public override Expression<Func<User, bool>> ToWherePredicate()
        {
            return u => (Username == null || Username == u.Username)
                        && (Password == null || Password == u.Password);
        }
    }
}