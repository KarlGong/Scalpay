using System;
using System.Linq.Expressions;
using ScalpayApi.Models;

namespace ScalpayApi.Services.Parameters.Criterias
{
    public class UserCriteria : Criteria<User>
    {
        public string ApiKey { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string SearchText { get; set; }

        public override Expression<Func<User, bool>> ToWherePredicate()
        {
            return u => (ApiKey == null || ApiKey == u.ApiKey)
                        && (Username == null || Username == u.Username)
                        && (Password == null || Password == u.Password)
                        && (SearchText == null
                            || u.Username.Contains(SearchText)
                            || u.FullName.Contains(SearchText)
                            || u.Email.Contains(SearchText));
        }
    }
}