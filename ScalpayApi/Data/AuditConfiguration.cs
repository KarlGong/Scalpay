using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class AuditConfiguration : IEntityTypeConfiguration<Audit>
    {
        public void Configure(EntityTypeBuilder<Audit> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Ignore(a => a.Args);

            builder.Property(a => a.ArgsString).HasColumnName("Args").IsRequired();

            builder.Property(a => a.InsertTime).ValueGeneratedOnAdd();

            builder.Property(a => a.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}