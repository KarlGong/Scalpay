using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ItemConfigConfiguration : IEntityTypeConfiguration<ItemConfig>
    {
        public void Configure(EntityTypeBuilder<ItemConfig> builder)
        {
            builder.Property(i => i.Mode).IsRequired();
            
            builder.Ignore(i => i.ParameterInfos);

            builder.Property(i => i.ParameterInfosString).HasColumnName("ParameterInfos").IsRequired();

            builder.Property(i => i.ResultDataType).IsRequired();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemKey)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}