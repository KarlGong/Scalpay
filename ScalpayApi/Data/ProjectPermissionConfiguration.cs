using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ProjectPermissionConfiguration: IEntityTypeConfiguration<ProjectPermission>
    {
        public void Configure(EntityTypeBuilder<ProjectPermission> builder)
        {
            builder.HasKey(p => p.Id);
            
            builder.Property(p => p.InsertTime).IsRequired();

            builder.Property(p => p.UpdateTime).IsRequired();
        }
    }
}