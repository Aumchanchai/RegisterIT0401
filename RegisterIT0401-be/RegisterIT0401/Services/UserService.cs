using DAL;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;
using RegisterIT0401.Interfaces;
using RegisterIT0401.Models;

namespace RegisterIT0401.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<UserResponseDto> CreateUserAsync(UserCreateDto request)
    {
        if (await IsEmailExistsAsync(request.Email))
        {
            throw new Exception("Email already exists.");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            ProfileBase64 = request.ProfileBase64,
            BirthDay = request.BirthDay,
            Occupation = request.Occupation,
            Sex = request.Sex
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            Message = $"save data success Id : {user.Id:00000}", // Assuming xxxxx format or just the ID padded
            Id = user.Id
        };
    }
}
