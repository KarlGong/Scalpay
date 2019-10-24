namespace Scalpay.Services.Parameters
{
    public class Rule
    {
        public string ItemKey { get; set; }

        public SExpression Condition { get; set; }

        public SExpression Result { get; set; }
    }
}