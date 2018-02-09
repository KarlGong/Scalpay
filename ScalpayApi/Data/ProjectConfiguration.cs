using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.HasKey(p => p.ProjectKey);

            builder.Property(p => p.Name).IsRequired();

            builder.Property(p => p.InsertTime).ValueGeneratedOnAdd();

            builder.Property(p => p.UpdateTime).ValueGeneratedOnAddOrUpdate();

            builder.HasMany(p => p.Items).WithOne(i => i.Project).HasForeignKey(i => i.ProjectKey)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}