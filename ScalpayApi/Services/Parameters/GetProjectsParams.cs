using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services.Parameters
{
    public class GetProjectsParams
    {
        public ProjectCriteria Criteria { get; set; } = new ProjectCriteria();
        
        public Pagination Pagination { get; set; } = new Pagination();
    }
}