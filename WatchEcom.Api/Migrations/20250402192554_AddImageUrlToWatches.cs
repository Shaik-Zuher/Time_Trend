using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchEcom.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToWatches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Watches",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Watches");
        }
    }
}
