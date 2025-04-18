namespace WatchEcom.Api.Models
{
    public class Wishlist
    {
        public int Id { get; set; }
        public string UserId { get; set; }=string.Empty;
        public int WatchId { get; set; }
        public DateTime DateAdded { get; set; }
        
        // Navigation property
        public virtual Watch? Watch { get; set; }

    }
}