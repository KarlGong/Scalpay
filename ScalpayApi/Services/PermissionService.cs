using System.Threading.Tasks;
using Scalpay.Enums;
using Scalpay.Exceptions;

namespace Scalpay.Services
{
    public interface IPermissionService
    {
        Task<bool> HasGlobalPermissionAsync(Permission permission);

        Task<bool> HasProjectPermissionAsync(string projectKey, Permission permission);
    }

    public class PermissionService : IPermissionService
    {
        private readonly IUserService _userService;
        private readonly IProjectPermissionService _projectPermissionService;

        public PermissionService(IUserService userService, IProjectPermissionService projectPermissionService)
        {
            _userService = userService;
            _projectPermissionService = projectPermissionService;
        }

        public async Task<bool> HasGlobalPermissionAsync(Permission permission)
        {
            try
            {
                var user = await _userService.GetCurrentUserAsync();
                return user.Role == Role.Admin ? Permission.Admin.HasFlag(permission): Permission.Read.HasFlag(permission);
            }
            catch (NotFoundException ex)
            {
                return false;
            }
        }

        public async Task<bool> HasProjectPermissionAsync(string projectKey, Permission permission)
        {
            try
            {
                var user = await _userService.GetCurrentUserAsync();
                return user.Role == Role.Admin || (await _projectPermissionService.GetCachedProjectPermissionAsync(projectKey, user.Username)).Permission.HasFlag(permission);
            }
            catch (NotFoundException ex)
            {
                return false;
            }
        }
    }
}