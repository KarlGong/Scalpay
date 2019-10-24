using System;
using System.Linq.Expressions;
using Scalpay.Models;

namespace Scalpay.Services.Parameters.Criterias
{
    public class ProjectCriteria : Criteria<Project>
    {
        public string ProjectKey { get; set; }

        public string SearchText { get; set; }

        public override Expression<Func<Project, bool>> ToWherePredicate()
        {
            return p => (ProjectKey == null || ProjectKey == p.ProjectKey)
                        && (SearchText == null
                            || p.ProjectKey.Contains(SearchText)
                            || p.Name.Contains(SearchText)
                            || p.Description.Contains(SearchText));
        }
    }
}