using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ConfigItemConfiguration : IEntityTypeConfiguration<ConfigItem>
    {
        public void Configure(EntityTypeBuilder<ConfigItem> builder)
        {
            builder.Property(i => i.Mode).IsRequired();
            
            builder.Ignore(i => i.ParameterInfos);

            builder.Property(i => i.ParameterInfosString).HasColumnName("ParameterInfos").IsRequired();

            builder.Property(i => i.ResultDataType).IsRequired();

            builder.HasMany(i => i.Rules).WithOne(r => r.ConfigItem).HasForeignKey(r => r.ItemKey)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}