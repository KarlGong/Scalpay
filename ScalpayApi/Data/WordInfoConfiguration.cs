using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class WordInfoConfiguration : IEntityTypeConfiguration<WordInfo>
    {
        public void Configure(EntityTypeBuilder<WordInfo> builder)
        {
            builder.HasKey(w => w.Id);
            
            builder.Property(w => w.InsertTime).ValueGeneratedOnAdd();

            builder.Property(w => w.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}