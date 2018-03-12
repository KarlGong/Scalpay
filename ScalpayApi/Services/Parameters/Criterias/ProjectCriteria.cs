using System;
using System.Linq.Expressions;
using ScalpayApi.Models;

namespace ScalpayApi.Services.Parameters.Criterias
{
    public class ProjectCriteria : Criteria<Project>
    {
        public string ProjectKey { get; set; }

        public string SearchText { get; set; }

        public override bool IsMatched(Project project)
        {
            return (ProjectKey == null || ProjectKey == project.ProjectKey)
                   && (SearchText == null
                       || project.ProjectKey.Contains(SearchText)
                       || project.Name.Contains(SearchText)
                       || project.Description.Contains(SearchText));
        }
    }
}