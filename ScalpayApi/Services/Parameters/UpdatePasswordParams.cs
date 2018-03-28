namespace ScalpayApi.Services.Parameters
{
    public class UpdatePasswordParams
    {
        public string Username { get; set; }
        
        public string CurrentPassword { get; set; }
        
        public string NewPassword { get; set; }
    }
}