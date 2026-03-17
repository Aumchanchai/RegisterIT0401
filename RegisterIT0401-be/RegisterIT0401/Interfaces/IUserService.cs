using RegisterIT0401.Models;

namespace RegisterIT0401.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> CreateUserAsync(UserCreateDto request);
    Task<bool> IsEmailExistsAsync(string email);
}
