// WatchEcom.Api/Controllers/WishlistController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using WatchEcom.Api.Data;
using WatchEcom.Api.Models;

namespace WatchEcom.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wishlist>>> GetUserWishlist()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var wishlist = await _context.Wishlists
                .Include(w => w.Watch)
                .Where(w => w.UserId == userId)
                .ToListAsync();
            return Ok(wishlist);
        }

        [HttpPost("{watchId}")]
        public async Task<ActionResult> AddToWishlist(int watchId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized(); // or BadRequest("User ID not found");

            
            // Check if already in wishlist
            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.WatchId == watchId);
                
            if (existing != null)
                return BadRequest("Watch already in wishlist");

            var wishlistItem = new Wishlist
            {
                UserId = userId,
                WatchId = watchId,
                DateAdded = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{watchId}")]
        public async Task<ActionResult> RemoveFromWishlist(int watchId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.WatchId == watchId);

            if (wishlistItem == null)
                return NotFound();

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}