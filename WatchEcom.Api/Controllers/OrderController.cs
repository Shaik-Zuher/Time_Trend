using Microsoft.AspNetCore.Mvc;//conatins ControllerBase class
using Microsoft.AspNetCore.Authorization; //  Lets you use [Authorize] for securing endpoints with JWT
using Microsoft.EntityFrameworkCore; //  Allows interaction with the database using Entity Framework
using WatchEcom.Api.Data; //  This is your own project’s data layer (contains ApplicationDbContext)
using WatchEcom.Api.Models; //  Your models like Watch.cs are in here

namespace WatchEcom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    //public class name_can_be anything :symbol for inheritance  ControllerBase is abstract class imported form line 1 module
    /*
     Ok(), BadRequest(), Unauthorized(), etc. → so you can return proper HTTP responses
     Access to things like Request, User, ModelState
     Model binding support (like [FromBody], [FromQuery])
     Authentication info (User.Identity.Name, etc.)
    */
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        //  Get all orders for a specific user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUser(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Watches) // Ensure watches are included
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound(new { message = "No orders found for this user." });
            }

            return Ok(orders);
        }

        // Place a new order
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            if (order == null || order.Watches == null || !order.Watches.Any())
            {
                return BadRequest(new { message = "Invalid order data." });
            }

            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrdersByUser), new { userId = order.UserId }, order);
        }

        //  Delete an order by ID
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order deleted successfully." });
        }
    }
}
