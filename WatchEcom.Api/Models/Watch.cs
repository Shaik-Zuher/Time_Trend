namespace WatchEcom.Api.Models
{
    public class Watch
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}

}
