using System.Collections.Generic;

namespace Backend.Models
{
    public class Property
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public ICollection<Client> Clients { get; set; } = new List<Client>();
    }
}