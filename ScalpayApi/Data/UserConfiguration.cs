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

            builder.Property(u => u.ApiKey).IsRequired();

            builder.Property(u => u.Privileges).HasConversion(
                    v => v.Sum(p => (int) p),
                    v => Enum.GetValues(typeof(Privilege)).Cast<Privilege>().Where(p => (v & (int) p) != 0).ToList())
                .IsRequired();

            builder.Property(u => u.InsertTime).ValueGeneratedOnAdd();

            builder.Property(u => u.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}