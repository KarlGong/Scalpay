using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ItemWordConfiguration : IEntityTypeConfiguration<ItemWord>
    {
        public void Configure(EntityTypeBuilder<ItemWord> builder)
        {
        }
    }
}