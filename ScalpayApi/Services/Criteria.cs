﻿using System;
using System.Linq.Expressions;
using Remotion.Linq.Clauses;

namespace Scalpay.Services
{
    public abstract class Criteria<T>
    {
        public abstract Expression<Func<T, bool>> ToWherePredicate();

        public int PageIndex { get; set; } = 0;

        public int PageSize { get; set; } = 20;

        public string OrderBy { get; set; }

        public OrderingDirection Direction { get; set; } = OrderingDirection.Asc;
    }
}