using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.UserName);

            builder.Property(u => u.Email).IsRequired();

            builder.Property(u => u.Password).IsRequired();

            builder.Property(u => u.FullName).IsRequired();

            builder.Property(u => u.ApiKey).IsRequired();

            builder.Property(u => u.PrivilegesInt).HasColumnName("Privileges").IsRequired();

            builder.Ignore(u => u.Privileges);

            builder.Property(u => u.InsertTime).ValueGeneratedOnAdd();

            builder.Property(u => u.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}