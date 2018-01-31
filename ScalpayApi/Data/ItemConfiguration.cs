using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ItemConfiguration: IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasAlternateKey(i => i.ItemKey);
            
            builder.Property(i => i.ItemKey).IsRequired();
            
            builder.Property(i => i.Name).IsRequired();
            
            builder.Property(i => i.Type).IsRequired();

            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();
            
            builder.Property(i => i.Project).IsRequired();
        }
    }
}