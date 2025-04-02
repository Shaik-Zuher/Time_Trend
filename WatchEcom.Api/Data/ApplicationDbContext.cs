using Microsoft.EntityFrameworkCore;
using WatchEcom.Api.Models;

namespace WatchEcom.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Watch> Watches { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}
