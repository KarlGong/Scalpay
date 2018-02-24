﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class RuleConfiguration : IEntityTypeConfiguration<Rule>
    {
        public void Configure(EntityTypeBuilder<Rule> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.ConditionString).HasColumnName("Condition").IsRequired();

            builder.Property(r => r.ResultString).HasColumnName("Result").IsRequired();

            builder.Property(r => r.Order).IsRequired();
            
            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}