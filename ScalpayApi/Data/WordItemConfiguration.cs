using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class WordItemConfiguration : IEntityTypeConfiguration<WordItem>
    {
        public void Configure(EntityTypeBuilder<WordItem> builder)
        {
        }
    }
}