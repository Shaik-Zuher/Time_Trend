//namespace used to group different tables or models.
//namespace name can be anything
namespace WatchEcom.Api.Models
{
    public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public ICollection<Watch> Watches { get; set; } = new List<Watch>();
}

}
//One namespace can have differnt classes but it easy to maintain with differnt files.