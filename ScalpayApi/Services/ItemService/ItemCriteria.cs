using System;
using System.Linq.Expressions;
using Scalpay.Models;

namespace Scalpay.Services.ItemService
{
    public class ItemCriteria : Criteria<Item>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }

        public override Expression<Func<Item, bool>> ToWherePredicate()
        {
            return i => (ItemKey == null || ItemKey == i.ItemKey)
                        && (ProjectKey == null || ProjectKey == i.ProjectKey);
        }
    }
}