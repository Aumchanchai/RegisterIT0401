using System.ComponentModel.DataAnnotations;

namespace RegisterIT0401.Models;

public class UserCreateDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    
    // To prevent exceeding practical JSON payload or nvarchar(max) limits gracefully, we limit Base64 string length.
    // 5MB file size translates to approx 6.67MB Base64 string. 7,000,000 characters is a safe bounds for 5MB images.
    [StringLength(7000000, ErrorMessage = "The profile image size exceeds the maximum allowed limit.")]
    public string ProfileBase64 { get; set; } = null!;
    
    public DateTime BirthDay { get; set; }
    public string Occupation { get; set; } = null!;
    public string Sex { get; set; } = null!;
}
