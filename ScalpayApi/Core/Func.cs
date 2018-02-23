namespace ScalpayApi.Core
{
    public class Func
    {
        public static SBool IsEqualTo(SNumber number1, SNumber number2) 
        {
            return new SBool(number1.Inner == number2.Inner);
        }

        public static SBool IsGreaterThan(SNumber number1, SNumber number2)
        {
            return new SBool(number1.Inner > number2.Inner);
        }
        
        public static SBool IsGreaterThanOrEqualTo(SNumber number1, SNumber number2)
        {
            return new SBool(number1.Inner >= number2.Inner);
        }

        public static SBool Not(SBool b)
        {
            return new SBool(!b.Inner);
        }
    }
}