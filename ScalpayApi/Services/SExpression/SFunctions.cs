using System;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SFunctions
    {
        #region SBool

        public static SBool BoolNot(SBool b)
        {
            return new SBool(!b.Inner);
        }

        public static SBool BoolIsEqualToBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Inner == b2.Inner);
        }

        public static SBool BoolIsNotEqualToBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Inner != b2.Inner);
        }

        #endregion

        #region SDateTime

        public static SBool DateTimeIsEqualToDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner == d2.Inner);
        }

        public static SBool DateTimeIsNotEqualToDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner != d2.Inner);
        }

        public static SBool DateTimeIsAfterDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner > d2.Inner);
        }

        public static SBool DateTimeIsBeforDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner < d2.Inner);
        }

        public static SBool DateTimeIsBetweenDateTimes(SDateTime d, SDateTime start, SDateTime end)
        {
            return new SBool(d.Inner >= start.Inner && d.Inner <= end.Inner);
        }

        public static SDateTime DateTimeAddYears(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddYears((int) n.Inner));
        }

        public static SDateTime DateTimeAddMonths(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddMonths((int) n.Inner));
        }

        public static SDateTime DateTimeAddDays(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddDays(n.Inner));
        }

        public static SDateTime DateTimeAddHours(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddHours(n.Inner));
        }

        public static SDateTime DateTimeAddMinutes(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddMinutes(n.Inner));
        }

        public static SDateTime DateTimeAddSeconds(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddSeconds(n.Inner));
        }

        public static SDateTime DateTimeAddSDuration(SDateTime d, SDuration du)
        {
            return new SDateTime(d.Inner.Add(du.Inner));
        }

        public static SNumber DateTimeGetYear(SDateTime d)
        {
            return new SNumber(d.Inner.Year);
        }

        public static SNumber DateTimeGetMonth(SDateTime d)
        {
            return new SNumber(d.Inner.Month);
        }

        public static SNumber DateTimeGetDay(SDateTime d)
        {
            return new SNumber(d.Inner.Day);
        }

        public static SNumber DateTimeGetHour(SDateTime d)
        {
            return new SNumber(d.Inner.Hour);
        }

        public static SNumber DateTimeGetMinute(SDateTime d)
        {
            return new SNumber(d.Inner.Minute);
        }

        public static SNumber DateTimeGetSecond(SDateTime d)
        {
            return new SNumber(d.Inner.Second);
        }

        public static SDateTime DateTimeNow()
        {
            return new SDateTime(DateTimeOffset.UtcNow);
        }

        #endregion

        #region SDuration

        public static SBool DurationIsEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner == du2.Inner);
        }

        public static SBool DurationIsNotEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner != du2.Inner);
        }

        public static SBool DurationIsGreaterThenDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner > du2.Inner);
        }

        public static SBool DurationIsGreaterThenOrEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner >= du2.Inner);
        }

        public static SBool DurationIsLessThenDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner < du2.Inner);
        }

        public static SBool DurationIsLessThenOrEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner <= du2.Inner);
        }

        public static SDuration DurationBetweenDateTimes(SDateTime d1, SDateTime d2)
        {
            return new SDuration(d1.Inner - d2.Inner);
        }

        #endregion

        #region SNumber

        public static SBool NumberIsEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner == n2.Inner);
        }

        public static SBool NumberIsNotEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner != n2.Inner);
        }

        public static SBool NumberIsGreaterThenNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner > n2.Inner);
        }

        public static SBool NumberIsGreaterThenOrEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner >= n2.Inner);
        }

        public static SBool NumberIsLessThenNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner < n2.Inner);
        }

        public static SBool NumberIsLessThenOrEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner <= n2.Inner);
        }
        
        public static SBool NumberIsBetweenNumbers(SNumber d, SNumber min, SNumber max)
        {
            return new SBool(d.Inner >= min.Inner && d.Inner <= max.Inner);
        }

        public static SNumber NumberAddNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner + n2.Inner);
        }

        public static SNumber NumberMinusNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner - n2.Inner);
        }

        public static SNumber NumberMultiplyNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner * n2.Inner);
        }

        public static SNumber NumberDivideNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner / n2.Inner);
        }

        public static SNumber NumberAbsolute(SNumber n)
        {
            return new SNumber(Math.Abs(n.Inner));
        }

        public static SNumber NumberRound(SNumber n, SNumber digits)
        {
            return new SNumber(Math.Round(n.Inner, (int) digits.Inner));
        }

        #endregion

        #region SNumberList

        public static SBool NumberListContainsNumber(SNumberList nl, SNumber n)
        {
            return new SBool(nl.Inner.Contains(n.Inner));
        }

        public static SBool NumberListDoesNotContainNumber(SNumberList nl, SNumber n)
        {
            return new SBool(!nl.Inner.Contains(n.Inner));
        }

        public static SBool NumberListIsEmpty(SNumberList nl)
        {
            return new SBool(!nl.Inner.Any());
        }

        public static SBool NumberListIsNotEmpty(SNumberList nl)
        {
            return new SBool(nl.Inner.Any());
        }

        public static SNumber NumberListGetCount(SNumberList nl)
        {
            return new SNumber(nl.Inner.Count);
        }

        public static SNumber NumberListGetValue(SNumberList nl, SNumber index)
        {
            return new SNumber(nl.Inner[(int) index.Inner]);
        }

        public static SNumber NumberListSum(SNumberList nl)
        {
            return new SNumber(nl.Inner.Sum());
        }

        public static SNumber NumberListAvg(SNumberList nl)
        {
            return new SNumber(nl.Inner.Average());
        }

        public static SNumber NumberListMax(SNumberList nl)
        {
            return new SNumber(nl.Inner.Max());
        }

        public static SNumber NumberListMin(SNumberList nl)
        {
            return new SNumber(nl.Inner.Min());
        }

        #endregion

        #region SString

        public static SBool StringIsEqualToString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner == s2.Inner);
        }

        public static SBool StringIsNotEqualToString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner != s2.Inner);
        }

        public static SBool StringStartsWithString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner.StartsWith(s2.Inner));
        }

        public static SBool StringContainsString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner.Contains(s2.Inner));
        }

        public static SString StringToLower(SString s)
        {
            return new SString(s.Inner.ToLower());
        }

        public static SString StringToUpper(SString s)
        {
            return new SString(s.Inner.ToUpper());
        }

        public static SString StringTrim(SString s)
        {
            return new SString(s.Inner.Trim());
        }

        public static SStringList StringSplit(SString s, SString separator)
        {
            return new SStringList(s.Inner.Split(separator.Inner).ToList());
        }

        public static SString StringConcatString(SString s1, SString s2)
        {
            return new SString(s1.Inner + s2.Inner);
        }

        public static SNumber StringGetLength(SString s)
        {
            return new SNumber(s.Inner.Length);
        }

        #endregion

        #region SStringDict

        public static SBool StringDictContainsKey(SStringDict sd, SString s)
        {
            return new SBool(sd.Inner.ContainsKey(s.Inner));
        }

        public static SBool StringDictContainsValue(SStringDict sd, SString s)
        {
            return new SBool(sd.Inner.ContainsValue(s.Inner));
        }

        public static SBool StringDictDoesNotContainKey(SStringDict sd, SString s)
        {
            return new SBool(!sd.Inner.ContainsKey(s.Inner));
        }

        public static SBool StringDictDoesNotContainValue(SStringDict sd, SString s)
        {
            return new SBool(!sd.Inner.ContainsValue(s.Inner));
        }

        public static SBool StringDictIsEmpty(SStringDict sd)
        {
            return new SBool(!sd.Inner.Any());
        }

        public static SBool StringDictIsNotEmpty(SStringDict sd)
        {
            return new SBool(sd.Inner.Any());
        }

        public static SNumber StringDictGetCount(SStringDict sd)
        {
            return new SNumber(sd.Inner.Count);
        }

        public static SString StringDictGetValue(SStringDict sd, SString key)
        {
            return new SString(sd.Inner[key.Inner]);
        }

        #endregion

        #region SStringList

        public static SBool StringListContainsString(SStringList sl, SString s, SBool ignoringCase)
        {
            return new SBool(sl.Inner.Any(i => i.Equals(s.Inner, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool StringListDoesNotContainString(SStringList sl, SString s, SBool ignoringCase)
        {
            return new SBool(!sl.Inner.Any(i => i.Equals(s.Inner, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool StringListIsEmpty(SStringList sl)
        {
            return new SBool(!sl.Inner.Any());
        }

        public static SBool StringListIsNotEmpty(SStringList sl)
        {
            return new SBool(sl.Inner.Any());
        }

        public static SNumber StringListGetCount(SStringList sl)
        {
            return new SNumber(sl.Inner.Count);
        }

        public static SString StringListGetValue(SStringList sl, SNumber index)
        {
            return new SString(sl.Inner[(int) index.Inner]);
        }

        #endregion
    }
}