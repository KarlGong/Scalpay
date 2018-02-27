namespace ScalpayApi.Services.SExpressions
{
    public class SBool : SData
    {
        public bool Inner { get; set; }

        public SBool(bool inner)
        {
            Inner = inner;
        }
    }
}