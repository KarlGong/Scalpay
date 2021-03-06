﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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

            builder.HasOne(i => i.Project).WithMany(p => p.Items).HasForeignKey(i => i.ProjectKey);
        }
    }
}