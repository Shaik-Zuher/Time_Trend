using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WatchEcom.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Security_Question = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Watches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Model = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Brand = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Watches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Watches_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Watches",
                columns: new[] { "Id", "Brand", "Description", "ImageUrl", "Model", "OrderId", "Price" },
                values: new object[,]
                {
                    { 1, "Rolex", "Luxury diving watch with stainless steel case", "/images/watches/1.jpg", "Submariner", null, 12000m },
                    { 2, "Casio", "Durable sports watch with shock resistance", "/images/watches/2.jpg", "G-Shock", null, 150m },
                    { 3, "Omega", "Moonwatch with chronograph functionality", "/images/watches/3.jpg", "Speedmaster", null, 5000m },
                    { 4, "Tag Heuer", "Professional diving watch with water resistance", "/images/watches/4.jpg", "Aquaracer", null, 2200m },
                    { 5, "IWC", "Aviation-inspired watch with sleek design", "/images/watches/5.jpg", "Pilot Mark XVIII", null, 4500m },
                    { 6, "Cartier", "Classic luxury watch with square case design", "/images/watches/6.jpg", "Santos", null, 7500m },
                    { 7, "Omega", "Diving watch with ceramic bezel", "/images/watches/7.jpg", "Seamaster", null, 4000m },
                    { 8, "Rolex", "Adventure-ready watch with high durability", "/images/watches/8.jpg", "Explorer", null, 10500m },
                    { 9, "Tissot", "Affordable luxury watch with integrated bracelet", "/images/watches/9.jpg", "Tissot PRX", null, 700m },
                    { 10, "Breitling", "Pilot watch with slide rule bezel", "/images/watches/10.jpg", "Navitimer", null, 6000m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Watches_OrderId",
                table: "Watches",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Watches");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
