using Microsoft.EntityFrameworkCore;
using ScalpayApi.Models;

namespace ScalpayApi.Data
{
    public class ScalpayDbContext: DbContext
    {
        public ScalpayDbContext(DbContextOptions<ScalpayDbContext> options) : base(options)
        {
            
        }
        
        public DbSet<Project> Projects { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemConfig> ItemConfigs { get; set; }
        public DbSet<ItemWord> ItemWords { get; set; }
        public DbSet<User> Users { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProjectConfiguration());
            modelBuilder.ApplyConfiguration(new ItemConfiguration());
            modelBuilder.ApplyConfiguration(new ItemConfigConfiguration());
            modelBuilder.ApplyConfiguration(new ItemWordConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new RuleConfiguration());
        }
    }
}