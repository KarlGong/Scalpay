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
            builder.HasKey(i => i.Id);

            builder.Property(i => i.ItemKey).IsRequired();
            builder.HasIndex(i => i.ItemKey).IsUnique();
            
            builder.Property(i => i.ProjectKey).IsRequired();
            builder.HasIndex(i => i.ProjectKey);

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
            
            builder.Property(i => i.InsertTime).IsRequired();

            builder.Property(i => i.UpdateTime).IsRequired();

            builder.Ignore(i => i.Rules);
        }
    }
}