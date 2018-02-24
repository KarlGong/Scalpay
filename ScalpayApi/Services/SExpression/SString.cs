namespace ScalpayApi.Services.SExpression
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