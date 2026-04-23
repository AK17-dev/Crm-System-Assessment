using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreatePropertyDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        public decimal Price { get; set; }
    }
}