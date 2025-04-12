using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WatchEcom.Api.Models;
using WatchEcom.Api.Data;

namespace WatchEcom.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

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
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
            {
                return BadRequest("Username already exists.");
            }

            // Hash password and security question answer before saving to DB
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Security_Question = BCrypt.Net.BCrypt.HashPassword(user.Security_Question); // Hash the security question answer
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }

        // Endpoint to verify the security answer
        [HttpPost("verify-security-answer")]
        public IActionResult VerifySecurityAnswer([FromBody] SecurityAnswerModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);
            
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Verify the security question answer (hashed answer stored in DB)
            bool isAnswerCorrect = BCrypt.Net.BCrypt.Verify(model.Answer, user.Security_Question);

            if (!isAnswerCorrect)
            {
                return Unauthorized("Incorrect answer.");
            }

            return Ok(new { isCorrect = true });
        }

        // Endpoint to reset the password after verifying the security question
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Hash the new password before saving
            user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Password reset successfully." });
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

    // Model for verifying the security answer
    public class SecurityAnswerModel
    {
        public string Username { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
    }

    // Model for resetting the password
    public class ResetPasswordModel
    {
        public string Username { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
