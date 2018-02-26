using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasKey(i => i.ItemKey);

            builder.Property(i => i.Name).IsRequired();

            builder.Property(i => i.Type).IsRequired();

            builder.Ignore(i => i.ParamDataType);

            builder.Property(i => i.ParamDataTypeString).HasColumnName("ParamDataType").IsRequired();

            builder.Ignore(i => i.ResultDataType);

            builder.Property(i => i.ResultDataTypeString).HasColumnName("ResultDataType").IsRequired();

            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemKey)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}