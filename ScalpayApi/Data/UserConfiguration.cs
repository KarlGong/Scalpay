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
            builder.HasKey(u => u.Username);

            builder.Property(u => u.Email).IsRequired();

            builder.Property(u => u.Password).IsRequired();

            builder.Property(u => u.FullName).IsRequired();
            
            builder.Property(i => i.Role).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<Role>(v))
                .IsRequired();

            builder.Property(u => u.InsertTime).IsRequired();

            builder.Property(u => u.UpdateTime).IsRequired();
        }
    }
}