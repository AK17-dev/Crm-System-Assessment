using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CreateClientDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public int PropertyId { get; set; }
    }
}