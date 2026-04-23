using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ClientsController(AppDbContext db)
        {
            _db = db;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim)) return null;

            return int.Parse(claim);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var clients = await _db.Clients
                .Include(c => c.Property)
                .Where(c => c.Property != null && c.Property.UserId == userId.Value)
                .ToListAsync();

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var client = await _db.Clients
                .Include(c => c.Property)
                .FirstOrDefaultAsync(c => c.Id == id && c.Property != null && c.Property.UserId == userId.Value);

            if (client == null) return NotFound();

            return Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var property = await _db.Properties
                .FirstOrDefaultAsync(p => p.Id == dto.PropertyId && p.UserId == userId.Value);

            if (property == null)
                return BadRequest(new { message = "Invalid propertyId or property does not belong to the current user." });

            var client = new Client
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                PropertyId = dto.PropertyId
            };

            _db.Clients.Add(client);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = client.Id }, client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateClientDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var client = await _db.Clients
                .Include(c => c.Property)
                .FirstOrDefaultAsync(c => c.Id == id && c.Property != null && c.Property.UserId == userId.Value);

            if (client == null) return NotFound();

            var property = await _db.Properties
                .FirstOrDefaultAsync(p => p.Id == dto.PropertyId && p.UserId == userId.Value);

            if (property == null)
                return BadRequest(new { message = "Invalid propertyId or property does not belong to the current user." });

            client.Name = dto.Name;
            client.Email = dto.Email;
            client.Phone = dto.Phone;
            client.PropertyId = dto.PropertyId;

            await _db.SaveChangesAsync();

            return Ok(client);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var client = await _db.Clients
                .Include(c => c.Property)
                .FirstOrDefaultAsync(c => c.Id == id && c.Property != null && c.Property.UserId == userId.Value);

            if (client == null) return NotFound();

            _db.Clients.Remove(client);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Deleted" });
        }
    }
}