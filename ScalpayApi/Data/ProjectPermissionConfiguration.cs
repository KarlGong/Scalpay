using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ProjectPermissionConfiguration: IEntityTypeConfiguration<ProjectPermission>
    {
        public void Configure(EntityTypeBuilder<ProjectPermission> builder)
        {
            builder.Property(pp => pp.Permission).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<Permission>(v))
                .IsRequired();
        }
    }
}