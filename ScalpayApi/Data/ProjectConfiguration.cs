﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.ProjectKey).IsRequired();

            builder.Property(p => p.Name).IsRequired();
            
            builder.Property(p => p.Version).IsRequired();
            
            builder.Property(p => p.IsLatest).IsRequired();

            builder.Property(p => p.InsertTime).IsRequired();

            builder.Property(p => p.UpdateTime).IsRequired();
        }
    }
}