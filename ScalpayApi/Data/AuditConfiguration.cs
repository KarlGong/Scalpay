using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class AuditConfiguration : IEntityTypeConfiguration<Audit>
    {
        public void Configure(EntityTypeBuilder<Audit> builder)
        {
            builder.HasKey(a => a.Id);
            
            builder.Property(a => a.AuditType).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<AuditType>(v))
                .IsRequired();
            
            builder.Property(a => a.Args).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject(v))
                .IsRequired();

            builder.Property(a => a.InsertTime).IsRequired();

            builder.Property(a => a.UpdateTime).IsRequired();
        }
    }
}