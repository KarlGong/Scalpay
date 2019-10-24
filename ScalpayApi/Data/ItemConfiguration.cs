using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Scalpay.Enums;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.ItemKey).IsRequired();

            builder.Property(i => i.Name).IsRequired();

            builder.Property(i => i.Version).IsRequired();

            builder.Property(i => i.IsLatest).IsRequired();

            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();

            builder.Property(i => i.Mode).HasConversion(
                    v => (int) v,
                    v => (ItemMode) v)
                .IsRequired();

            builder.Property(i => i.ParameterInfos).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<ParameterInfo>>(v))
                .IsRequired();

            builder.Property(i => i.ResultDataType).IsRequired();

            builder.Property(i => i.DefaultResult).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<SExpression>(v))
                .IsRequired();

            builder.Property(i => i.ProjectKey).IsRequired();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}