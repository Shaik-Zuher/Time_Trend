using Microsoft.AspNetCore.Mvc;//conatins ControllerBase class
using Microsoft.AspNetCore.Authorization; //  Lets you use [Authorize] for securing endpoints with JWT
using Microsoft.EntityFrameworkCore; //  Allows interaction with the database using Entity Framework
using WatchEcom.Api.Data; //  This is your own project’s data layer (contains ApplicationDbContext)
using WatchEcom.Api.Models; //  Your models like Watch.cs are in here
namespace WatchEcom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchController : ControllerBase
    //public class name_can_be anything :symbol for inheritance  ControllerBase is abstract class imported form line 1 module
    /*
     Ok(), BadRequest(), Unauthorized(), etc. → so you can return proper HTTP responses
     Access to things like Request, User, ModelState
     Model binding support (like [FromBody], [FromQuery])
     Authentication info (User.Identity.Name, etc.)
    */
    {
        private readonly ApplicationDbContext _context;

        public WatchController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // TEST ENDPOINT - CHECK IF API WORKS
        [HttpGet("test")]
        public IActionResult GetTestResponse()
        {
            return Ok(new { message = "API is working!" });
        }

        // GET: api/Watch (List All Watches)
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
                w.ImageUrl 
            }).ToListAsync();
        }

        //  GET: api/Watch/5 (Get Watch by ID)
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

        //  POST: api/Watch (Create New Watch)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Watch>> PostWatch(Watch watch)
        {
            _context.Watches.Add(watch);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWatch), new { id = watch.Id }, watch);
        }

        //  PUT: api/Watch/5 (Update Watch)
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

        // DELETE: api/Watch/5 (Delete Watch)
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
