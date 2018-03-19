using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
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
            
            builder.Property(i => i.Mode).IsRequired();
            
            builder.Ignore(i => i.ParameterInfos);

            builder.Property(i => i.ParameterInfosString).HasColumnName("ParameterInfos").IsRequired();

            builder.Property(i => i.ResultDataType).IsRequired();
            
            builder.Ignore(i => i.DefaultResult);

            builder.Property(i => i.DefaultResultString).HasColumnName("DefaultResult").IsRequired();

            builder.Property(i => i.ProjectKey).IsRequired();

            builder.HasMany(i => i.Rules).WithOne(r => r.Item).HasForeignKey(r => r.ItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}