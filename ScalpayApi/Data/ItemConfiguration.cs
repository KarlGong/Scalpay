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
            builder.HasIndex(i => i.ItemKey).IsUnique();
            
            builder.Property(i => i.ParameterInfos).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<ParameterInfo>>(v));

            builder.Property(i => i.ResultDataType).HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<SDataType>(v));

            builder.Property(i => i.DefaultResult).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<SExpression>(v));
            
            builder.Property(i => i.Rules).HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<Rule>>(v));
        }
    }
}