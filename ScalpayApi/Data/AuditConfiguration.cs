using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class AuditConfiguration : IEntityTypeConfiguration<Audit>
    {
        public void Configure(EntityTypeBuilder<Audit> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Args).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject(v))
                .IsRequired();

            builder.Property(a => a.InsertTime).ValueGeneratedOnAdd();

            builder.Property(a => a.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}