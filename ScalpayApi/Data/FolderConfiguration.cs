using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class FolderConfiguration : IEntityTypeConfiguration<Folder>
    {
        public void Configure(EntityTypeBuilder<Folder> builder)
        {
            builder.Property(f => f.Name).IsRequired();

            builder.Property(f => f.InsertTime).ValueGeneratedOnAdd();

            builder.Property(f => f.UpdateTime).ValueGeneratedOnAddOrUpdate();

            builder.HasMany(f => f.SubFolders).WithOne(f => f.ParentFolder).HasForeignKey(f => f.ParentFolderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(f => f.SubItems).WithOne(i => i.ParentFolder).HasForeignKey(i => i.ParentFolderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}