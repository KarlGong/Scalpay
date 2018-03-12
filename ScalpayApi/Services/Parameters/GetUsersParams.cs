using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services.Parameters
{
    public class GetUsersParams
    {
        public UserCriteria Criteria { get; set; } = new UserCriteria();
        
        public Pagination Pagination { get; set; } = new Pagination();
    }
}