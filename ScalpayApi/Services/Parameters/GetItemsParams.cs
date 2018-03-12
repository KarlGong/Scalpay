using ScalpayApi.Services.Parameters.Criterias;

namespace ScalpayApi.Services.Parameters
{
    public class GetItemsParams
    {
        public ItemCriteria Criteria { get; set; } = new ItemCriteria();

        public Pagination Pagination { get; set; } = new Pagination();
    }
}