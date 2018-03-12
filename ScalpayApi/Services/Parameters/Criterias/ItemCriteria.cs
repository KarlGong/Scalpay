using System;
using System.Linq.Expressions;
using ScalpayApi.Enums;
using ScalpayApi.Models;

namespace ScalpayApi.Services.Parameters.Criterias
{
    public class ItemCriteria : Criteria<Item>
    {
        public string ItemKey { get; set; }

        public string ProjectKey { get; set; }

        public ItemType? ItemType { get; set; }

        public string SearchText { get; set; }

        public override Expression<Func<Item, bool>> ToWherePredicate()
        {
            return i => (ItemKey == null || ItemKey == i.ItemKey)
                        && (ProjectKey == null || ProjectKey == i.Project.ProjectKey)
                        && (ItemType == null || ItemType == i.Type)
                        && (SearchText == null
                            || i.ItemKey.Contains(SearchText)
                            || i.Name.Contains(SearchText)
                            || i.Description.Contains(SearchText));
        }
    }
}