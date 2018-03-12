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

        public override bool IsMatched(Item item)
        {
            return (ItemKey == null || ItemKey == item.ItemKey)
                   && (ProjectKey == null || ProjectKey == item.Project.ProjectKey)
                   && (ItemType == null || ItemType == item.Type)
                   && (SearchText == null
                       || item.ItemKey.Contains(SearchText)
                       || item.Name.Contains(SearchText)
                       || item.Description.Contains(SearchText));
            ;
        }
    }
}