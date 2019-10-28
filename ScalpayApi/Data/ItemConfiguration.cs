using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Scalpay.Enums;
using Scalpay.Models;
using Scalpay.Models.SExpressions;

namespace Scalpay.Data
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasKey(i => i.ItemKey);

            builder.Property(i => i.Name).IsRequired();

            builder.Property(i => i.InsertTime).IsRequired();

            builder.Property(i => i.UpdateTime).IsRequired();

            builder.Property(i => i.Mode).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<ItemMode>(v))
                .IsRequired();

            builder.Property(i => i.ParameterInfos).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<ParameterInfo>>(v))
                .IsRequired();

            builder.Property(i => i.ResultDataType).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<SDataType>(v))
                .IsRequired();

            builder.Property(i => i.DefaultResult).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<SExpression>(v))
                .IsRequired();

            builder.Property(i => i.ProjectKey).IsRequired();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemKey);
        }
    }
}