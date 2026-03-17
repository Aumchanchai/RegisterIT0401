using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = null!;

    // Using string to store base64 representation of the image
    [Required]
    public string ProfileBase64 { get; set; } = null!;

    [Required]
    public DateTime BirthDay { get; set; }

    [Required]
    [MaxLength(100)]
    public string Occupation { get; set; } = null!;

    [Required]
    [MaxLength(10)]
    public string Sex { get; set; } = null!; // "Male" or "Female"
}
