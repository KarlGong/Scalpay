using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ScalpayDbContext : DbContext
    {
        public ScalpayDbContext(DbContextOptions<ScalpayDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Project> Projects { get; set; }

        public DbSet<Item> Items { get; set; }

        public DbSet<ProjectPermission> ProjectPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());

            modelBuilder.ApplyConfiguration(new ProjectConfiguration());

            modelBuilder.ApplyConfiguration(new ItemConfiguration());

            modelBuilder.ApplyConfiguration(new ProjectPermissionConfiguration());
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.OriginalValues["InsertTime"] == null || entry.OriginalValues["InsertTime"].ToString().RoughEquals(DateTime.MinValue.ToString()))
                {
                    entry.CurrentValues["InsertTime"] = DateTime.UtcNow;
                }
                else
                {
                    entry.CurrentValues["InsertTime"] = entry.OriginalValues["InsertTime"];
                }

                entry.CurrentValues["UpdateTime"] = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.OriginalValues["InsertTime"] == null || entry.OriginalValues["InsertTime"].ToString().RoughEquals(DateTime.MinValue.ToString()))
                {
                    entry.CurrentValues["InsertTime"] = DateTime.UtcNow;
                }
                else
                {
                    entry.CurrentValues["InsertTime"] = entry.OriginalValues["InsertTime"];
                }

                entry.CurrentValues["UpdateTime"] = DateTime.UtcNow;
            }

            return base.SaveChanges();
        }
    }
}