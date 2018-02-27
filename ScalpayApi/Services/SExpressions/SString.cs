namespace ScalpayApi.Services.SExpressions
{
    public class SString: SData
    {
        public string Inner { get; set; }

        public SString(string inner)
        {
            Inner = inner;
        }
    }
}