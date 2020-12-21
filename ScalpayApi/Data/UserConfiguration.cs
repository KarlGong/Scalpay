using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasIndex(u => u.Username).IsUnique();
            
            builder.Property(u => u.Role).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<Role>(v))
                .IsRequired();
        }
    }
}