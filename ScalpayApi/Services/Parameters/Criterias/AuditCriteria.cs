using System;
using System.Linq.Expressions;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services.Parameters.Criterias
{
    public class AuditCriteria : Criteria<Audit>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }

        public string OperatorUserName { get; set; }

        public override Expression<Func<Audit, bool>> ToWherePredicate()
        {
            return a => (ItemKey == null || ItemKey == a.ItemKey)
                        && (ProjectKey == null || ProjectKey == a.ProjectKey)
                        && (OperatorUserName == null || OperatorUserName == a.OperatorUserName);
        }
    }
}