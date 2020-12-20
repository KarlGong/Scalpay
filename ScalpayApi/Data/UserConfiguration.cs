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
            builder.Property(u => u.Role).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<Role>(v))
                .IsRequired();
        }
    }
}