using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.ProjectKey).IsRequired();
            builder.HasIndex(p => p.ProjectKey).IsUnique();

            builder.Property(p => p.InsertTime).IsRequired();

            builder.Property(p => p.UpdateTime).IsRequired();
        }
    }
}