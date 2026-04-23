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
    public class PropertiesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PropertiesController(AppDbContext db)
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

            var props = await _db.Properties
                .Where(p => p.UserId == userId.Value)
                .Include(p => p.Clients)
                .ToListAsync();

            return Ok(props);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var prop = await _db.Properties
                .Include(p => p.Clients)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value);

            if (prop == null) return NotFound();

            return Ok(prop);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePropertyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var property = new Property
            {
                Title = dto.Title,
                Address = dto.Address,
                Price = dto.Price,
                UserId = userId.Value
            };

            _db.Properties.Add(property);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = property.Id }, property);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePropertyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var prop = await _db.Properties.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value);
            if (prop == null) return NotFound();

            prop.Title = dto.Title;
            prop.Address = dto.Address;
            prop.Price = dto.Price;

            await _db.SaveChangesAsync();
            return Ok(prop);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var prop = await _db.Properties.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value);
            if (prop == null) return NotFound();

            _db.Properties.Remove(prop);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Deleted" });
        }
    }
}