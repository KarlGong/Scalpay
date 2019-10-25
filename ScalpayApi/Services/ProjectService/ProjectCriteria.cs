using System;
using System.Linq.Expressions;
using Scalpay.Models;

namespace Scalpay.Services.ProjectService
{
    public class ProjectCriteria : Criteria<Project>
    {
        public string ProjectKey { get; set; }

        public override Expression<Func<Project, bool>> ToWherePredicate()
        {
            return p => (ProjectKey == null || ProjectKey == p.ProjectKey);
        }
    }
}