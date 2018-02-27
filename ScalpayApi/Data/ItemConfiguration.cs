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

            builder.Ignore(i => i.ParamsDataTypes);

            builder.Property(i => i.ParamsDataTypesString).HasColumnName("ParamsDataTypes").IsRequired();

            builder.Property(i => i.ResultDataType).IsRequired();

            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemKey)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}