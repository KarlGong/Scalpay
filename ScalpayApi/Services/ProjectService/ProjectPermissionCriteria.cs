using System;
using System.Linq.Expressions;
using Scalpay.Models;

namespace Scalpay.Services.ProjectService
{
    public class ProjectPermissionCriteria : Criteria<ProjectPermission>
    {
        public string ProjectKey { get; set; }

        public string Username { get; set; }

        public override Expression<Func<ProjectPermission, bool>> ToWherePredicate()
        {
            return p => (ProjectKey == null || ProjectKey == p.ProjectKey)
                        && (Username == null || Username == p.ProjectKey);
        }
    }
}