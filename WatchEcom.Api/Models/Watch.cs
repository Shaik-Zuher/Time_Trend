//namespace used to group different tables or models.
//namespace name can be anything
namespace WatchEcom.Api.Models
{
    public class Watch
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; }=string.Empty;

}

}
//One namespace can have differnt classes but it easy to maintain with differnt files.