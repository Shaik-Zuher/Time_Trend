using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchEcom.Api.Data;
using WatchEcom.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WatchEcom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WatchController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // ✅ TEST ENDPOINT - CHECK IF API WORKS
        [HttpGet("test")]
        public IActionResult GetTestResponse()
        {
            return Ok(new { message = "API is working!" });
        }

        // ✅ GET: api/Watch (List All Watches)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetWatches()
        {
            return await _context.Watches.Select(w => new
            {
                w.Id,
                w.Brand,
                w.Model,
                w.Price,
                w.Description,
                w.ImageUrl // ✅ Ensure this is included
            }).ToListAsync();
        }

        // ✅ GET: api/Watch/5 (Get Watch by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetWatch(int id)
        {
            var watch = await _context.Watches.FindAsync(id);
            if (watch == null)
            {
                return NotFound();
            }
            return new
            {
                watch.Id,
                watch.Brand,
                watch.Model,
                watch.Price,
                watch.Description,
                watch.ImageUrl
            };
        }

        // ✅ POST: api/Watch (Create New Watch)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Watch>> PostWatch(Watch watch)
        {
            _context.Watches.Add(watch);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWatch), new { id = watch.Id }, watch);
        }

        // ✅ PUT: api/Watch/5 (Update Watch)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutWatch(int id, Watch watch)
        {
            if (id != watch.Id)
                return BadRequest();

            _context.Entry(watch).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Watch/5 (Delete Watch)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteWatch(int id)
        {
            var watch = await _context.Watches.FindAsync(id);
            if (watch == null)
                return NotFound();

            _context.Watches.Remove(watch);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
