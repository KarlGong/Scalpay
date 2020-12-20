namespace System
{
    public static class StringExtension
    {
        public static bool RoughEquals(this string str, string otherStr)
        {
            return str.Equals(otherStr, StringComparison.OrdinalIgnoreCase);
        }

        public static bool RoughContains(this string str, string subStr)
        {
            return str.Contains(subStr, StringComparison.OrdinalIgnoreCase);
        }
    }
}