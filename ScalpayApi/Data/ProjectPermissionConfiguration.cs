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
            
            builder.HasOne(pp => pp.Project).WithMany(p => p.Permissions).HasForeignKey(pp => pp.ProjectKey);

            builder.HasOne(pp => pp.User).WithMany(u => u.ProjectPermissions).HasForeignKey(pp => pp.Username);
        }
    }
}