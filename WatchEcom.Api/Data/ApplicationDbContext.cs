//Heart of database

using Microsoft.EntityFrameworkCore;
using WatchEcom.Api.Models;

namespace WatchEcom.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }//This is what connects mysql in connection strings in appsettings.json

        //Creates tables
        public DbSet<User> Users { get; set; }
        public DbSet<Watch> Watches { get; set; }
        public DbSet<Order> Orders { get; set; }
        //If no migrations folder create a migration by running dotnet ef migrations add Init
        //Seed data-Some sort of predefined data thats why we run dotnet ef database update
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data for Watches table
            modelBuilder.Entity<Watch>().HasData(
            new Watch { Id = 1, Model = "Submariner", Brand = "Rolex", Price = 12000, Description = "Luxury diving watch with stainless steel case", ImageUrl = "/images/watches/1.jpg", Category = "Luxury Series" },
            new Watch { Id = 2, Model = "G-Shock", Brand = "Casio", Price = 150, Description = "Durable sports watch with shock resistance", ImageUrl = "/images/watches/2.jpg", Category = "Sports Edition" },
            new Watch { Id = 3, Model = "Speedmaster", Brand = "Omega", Price = 5000, Description = "Moonwatch with chronograph functionality", ImageUrl = "/images/watches/3.jpg", Category = "Luxury Series" },
            new Watch { Id = 4, Model = "Aquaracer", Brand = "Tag Heuer", Price = 2200, Description = "Professional diving watch with water resistance", ImageUrl = "/images/watches/4.jpg", Category = "Luxury Series" },
            new Watch { Id = 5, Model = "Pilot Mark XVIII", Brand = "IWC", Price = 4500, Description = "Aviation-inspired watch with sleek design", ImageUrl = "/images/watches/5.jpg", Category = "Classic Designs" },
            new Watch { Id = 6, Model = "Santos", Brand = "Cartier", Price = 7500, Description = "Classic luxury watch with square case design", ImageUrl = "/images/watches/6.jpg", Category = "Luxury Series" },
            new Watch { Id = 7, Model = "Seamaster", Brand = "Omega", Price = 4000, Description = "Diving watch with ceramic bezel", ImageUrl = "/images/watches/7.jpg", Category = "Sports Edition" },
            new Watch { Id = 8, Model = "Explorer", Brand = "Rolex", Price = 10500, Description = "Adventure-ready watch with high durability", ImageUrl = "/images/watches/8.jpg", Category = "Luxury Series" },
            new Watch { Id = 9, Model = "Tissot PRX", Brand = "Tissot", Price = 700, Description = "Affordable luxury watch with integrated bracelet", ImageUrl = "/images/watches/9.jpg", Category = "Classic Designs" },
            new Watch { Id = 10, Model = "Navitimer", Brand = "Breitling", Price = 6000, Description = "Pilot watch with slide rule bezel", ImageUrl = "/images/watches/10.jpg", Category = "Classic Designs" }
        );
        }
    }
}
