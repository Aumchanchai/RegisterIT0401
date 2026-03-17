using DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using RegisterIT0401.Services;
using RegisterIT0401.Interfaces;
using Microsoft.Data.Sqlite;

namespace RegisterIT0401.Tests
{
    public static class DependencyResolver
    {
        public static ServiceProvider BuildServiceProvider()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("globalTestSettings.json", optional: false)
                .Build();

            var services = new ServiceCollection();
            services.AddSingleton<IConfiguration>(configuration);

            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(connection));

            services.AddScoped<IUserService, UserService>();

            var provider = services.BuildServiceProvider();

            // 3. จำเป็นต้องสั่งสร้าง Schema ตารางจำลองใน Memory ก่อนเริ่มใช้งาน
            using (var scope = provider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.EnsureCreated();
            }

            return provider;
        }
    }
}
