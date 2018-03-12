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

        public override bool IsMatched(User user)
        {
            return (ApiKey == null || ApiKey == user.ApiKey)
                   && (Username == null || Username == user.Username)
                   && (Password == null || Password == user.Password)
                   && (SearchText == null
                       || user.Username.Contains(SearchText)
                       || user.FullName.Contains(SearchText)
                       || user.Email.Contains(SearchText));
        }
    }
}