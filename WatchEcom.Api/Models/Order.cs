using System;
using System.Collections.Generic;

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
