using Microsoft.AspNetCore.Mvc;//conatins ControllerBase class
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WatchEcom.Api.Models;
using WatchEcom.Api.Data;

namespace WatchEcom.Api.Controllers
{
    [ApiController] //→ Tells ASP.NET that this is an API controller (automatically handles model validation, JSON, etc.)
    [Route("api/auth")] //→ Means all routes in here start with /api/auth


    public class AuthController : ControllerBase
    //public class name_can_be anything :symbol for inheritance  ControllerBase is abstract class imported form line 1 module
    /*
     Ok(), BadRequest(), Unauthorized(), etc. → so you can return proper HTTP responses
     Access to things like Request, User, ModelState
     Model binding support (like [FromBody], [FromQuery])
     Authentication info (User.Identity.Name, etc.)
    */
    {
        private readonly IConfiguration _config;//_config → lets you access stuff from appsettings.json (like JWT keys)

        private readonly ApplicationDbContext _context;//_context → your Entity Framework database context to query users


        public AuthController(IConfiguration config, ApplicationDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User login)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == login.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return Unauthorized("Invalid credentials.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
            /*
            Takes in a User (from JSON body)
            Checks if the username exists and password is correct (BCrypt.Verify)
            If good → generates a JWT token
            If bad → returns 401 Unauthorized
            */
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            /*
            Checks if username already exists
            Hashes the password using BCrypt
            Saves new user to the database
            Returns success message
            */
            if (_context.Users.Any(u => u.Username == user.Username))
            {
                return BadRequest("Username already exists.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:DurationInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
