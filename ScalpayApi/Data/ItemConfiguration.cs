using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ItemConfiguration: IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.Property(i => i.Key).IsRequired();
            
            builder.Property(i => i.Name).IsRequired();

            builder.Property(i => i.InsertTime).ValueGeneratedOnAdd();

            builder.Property(i => i.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}