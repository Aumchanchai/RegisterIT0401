using Microsoft.AspNetCore.Mvc;
using RegisterIT0401.Interfaces;
using RegisterIT0401.Models;

namespace RegisterIT0401.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _userService.CreateUserAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while saving the user", Details = ex.Message });
        }
    }
    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { Message = "Email is required." });
        }

        var exists = await _userService.IsEmailExistsAsync(email);
        return Ok(exists);
    }
}
