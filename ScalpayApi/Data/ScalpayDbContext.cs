using Microsoft.EntityFrameworkCore;
using Scalpay.Models;

namespace Scalpay.Data
{
    public class ScalpayDbContext: DbContext
    {
        public ScalpayDbContext(DbContextOptions<ScalpayDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        
        public DbSet<Project> Projects { get; set; }
        
        public DbSet<Item> Items { get; set; }
        
        public DbSet<Audit> Audits { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            
            modelBuilder.ApplyConfiguration(new ProjectConfiguration());
            
            modelBuilder.ApplyConfiguration(new ItemConfiguration());
            
            modelBuilder.ApplyConfiguration(new RuleConfiguration());

            modelBuilder.ApplyConfiguration(new AuditConfiguration());
        }
    }
}