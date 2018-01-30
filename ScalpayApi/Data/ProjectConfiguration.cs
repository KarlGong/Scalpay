using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ProjectConfiguration: IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.Property(p => p.Key).IsRequired();
            
            builder.Property(p => p.Name).IsRequired();

            builder.Property(p => p.InsertTime).ValueGeneratedOnAdd();

            builder.Property(p => p.UpdateTime).ValueGeneratedOnAddOrUpdate();
        }
    }
}