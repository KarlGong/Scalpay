using System;
using System.Linq;

namespace ScalpayApi.Services.SExpression
{
    public class SFunctions
    {
        #region SBool

        public static SBool SBoolNot(SBool b)
        {
            return new SBool(!b.Inner);
        }

        public static SBool SBoolIsEqualToSBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Inner == b2.Inner);
        }

        public static SBool SBoolIsNotEqualToSBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Inner != b2.Inner);
        }

        #endregion

        #region SDateTime

        public static SBool SDateTimeIsEqualToSDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner == d2.Inner);
        }

        public static SBool SDateTimeIsNotEqualToSDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner != d2.Inner);
        }

        public static SBool SDateTimeIsAfterSDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner > d2.Inner);
        }

        public static SBool SDateTimeIsBeforeSDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Inner < d2.Inner);
        }

        public static SBool SDateTimeIsBetweenSDateTimes(SDateTime d, SDateTime start, SDateTime end)
        {
            return new SBool(d.Inner >= start.Inner && d.Inner <= end.Inner);
        }

        public static SDateTime SDateTimeAddYears(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddYears((int) n.Inner));
        }

        public static SDateTime SDateTimeAddMonths(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddMonths((int) n.Inner));
        }

        public static SDateTime SDateTimeAddDays(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddDays(n.Inner));
        }

        public static SDateTime SDateTimeAddHours(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddHours(n.Inner));
        }

        public static SDateTime SDateTimeAddMinutes(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddMinutes(n.Inner));
        }

        public static SDateTime SDateTimeAddSeconds(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Inner.AddSeconds(n.Inner));
        }

        public static SDateTime SDateTimeAddSDuration(SDateTime d, SDuration du)
        {
            return new SDateTime(d.Inner.Add(du.Inner));
        }

        public static SNumber SDateTimeGetYear(SDateTime d)
        {
            return new SNumber(d.Inner.Year);
        }

        public static SNumber SDateTimeGetMonth(SDateTime d)
        {
            return new SNumber(d.Inner.Month);
        }

        public static SNumber SDateTimeGetDay(SDateTime d)
        {
            return new SNumber(d.Inner.Day);
        }

        public static SNumber SDateTimeGetHour(SDateTime d)
        {
            return new SNumber(d.Inner.Hour);
        }

        public static SNumber SDateTimeGetMinute(SDateTime d)
        {
            return new SNumber(d.Inner.Minute);
        }

        public static SNumber SDateTimeGetSecond(SDateTime d)
        {
            return new SNumber(d.Inner.Second);
        }

        public static SDateTime SDateTimeNow()
        {
            return new SDateTime(DateTimeOffset.UtcNow);
        }

        #endregion

        #region SDuration

        public static SBool SDurationIsEqualToSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner == du2.Inner);
        }

        public static SBool SDurationIsNotEqualToSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner != du2.Inner);
        }

        public static SBool SDurationIsGreaterThenSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner > du2.Inner);
        }

        public static SBool SDurationIsGreaterThenOrEqualToSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner >= du2.Inner);
        }

        public static SBool SDurationIsLessThenSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner < du2.Inner);
        }

        public static SBool SDurationIsLessThenOrEqualToSDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Inner <= du2.Inner);
        }

        public static SDuration SDurationBetweenSDateTimes(SDateTime d1, SDateTime d2)
        {
            return new SDuration(d1.Inner - d2.Inner);
        }

        #endregion

        #region SNumber

        public static SBool SNumberIsEqualToSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner == n2.Inner);
        }

        public static SBool SNumberIsNotEqualToSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner != n2.Inner);
        }

        public static SBool SNumberIsGreaterThenSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner > n2.Inner);
        }

        public static SBool SNumberIsGreaterThenOrEqualToSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner >= n2.Inner);
        }

        public static SBool SNumberIsLessThenSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner < n2.Inner);
        }

        public static SBool SNumberIsLessThenOrEqualToSNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Inner <= n2.Inner);
        }
        
        public static SBool SNumberIsBetweenSNumbers(SNumber d, SNumber min, SNumber max)
        {
            return new SBool(d.Inner >= min.Inner && d.Inner <= max.Inner);
        }

        public static SNumber SNumberAddSNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner + n2.Inner);
        }

        public static SNumber SNumberMinusSNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner - n2.Inner);
        }

        public static SNumber SNumberMultiplySNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner * n2.Inner);
        }

        public static SNumber SNumberDivideSNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Inner / n2.Inner);
        }

        public static SNumber SNumberAbsolute(SNumber n)
        {
            return new SNumber(Math.Abs(n.Inner));
        }

        public static SNumber SNumberRound(SNumber n, SNumber digits)
        {
            return new SNumber(Math.Round(n.Inner, (int) digits.Inner));
        }

        #endregion

        #region SNumberDict

        public static SBool SNumberDictContainsKey(SNumberDict nd, SString s)
        {
            return new SBool(nd.Inner.ContainsKey(s.Inner));
        }

        public static SBool SNumberDictContainsValue(SNumberDict nd, SNumber n)
        {
            return new SBool(nd.Inner.ContainsValue(n.Inner));
        }

        public static SBool SNumberDictDoesNotContainKey(SNumberDict nd, SString s)
        {
            return new SBool(!nd.Inner.ContainsKey(s.Inner));
        }

        public static SBool SNumberDictDoesNotContainValue(SNumberDict nd, SNumber n)
        {
            return new SBool(!nd.Inner.ContainsValue(n.Inner));
        }

        public static SBool SNumberDictIsEmpty(SNumberDict nd)
        {
            return new SBool(!nd.Inner.Any());
        }

        public static SBool SNumberDictIsNotEmpty(SNumberDict nd)
        {
            return new SBool(nd.Inner.Any());
        }

        public static SNumber SNumberDictGetCount(SNumberDict nd)
        {
            return new SNumber(nd.Inner.Count);
        }

        public static SNumber SNumberDictGetValue(SNumberDict nd, SString key)
        {
            return new SNumber(nd.Inner[key.Inner]);
        }

        #endregion

        #region SNumberList

        public static SBool SNumberListContainsSNumber(SNumberList nl, SNumber n)
        {
            return new SBool(nl.Inner.Contains(n.Inner));
        }

        public static SBool SNumberListDoesNotContainSNumber(SNumberList nl, SNumber n)
        {
            return new SBool(!nl.Inner.Contains(n.Inner));
        }

        public static SBool SNumberListIsEmpty(SNumberList nl)
        {
            return new SBool(!nl.Inner.Any());
        }

        public static SBool SNumberListIsNotEmpty(SNumberList nl)
        {
            return new SBool(nl.Inner.Any());
        }

        public static SNumber SNumberListGetCount(SNumberList nl)
        {
            return new SNumber(nl.Inner.Count);
        }

        public static SNumber SNumberListGetValue(SNumberList nl, SNumber index)
        {
            return new SNumber(nl.Inner[(int) index.Inner]);
        }

        public static SNumber SNumberListSum(SNumberList nl)
        {
            return new SNumber(nl.Inner.Sum());
        }

        public static SNumber SNumberListAvg(SNumberList nl)
        {
            return new SNumber(nl.Inner.Average());
        }

        public static SNumber SNumberListMax(SNumberList nl)
        {
            return new SNumber(nl.Inner.Max());
        }

        public static SNumber SNumberListMin(SNumberList nl)
        {
            return new SNumber(nl.Inner.Min());
        }

        #endregion

        #region SString

        public static SBool SStringIsEqualToSString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner == s2.Inner);
        }

        public static SBool SStringIsNotEqualToSString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner != s2.Inner);
        }

        public static SBool SStringStartsWithSString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner.StartsWith(s2.Inner));
        }

        public static SBool SStringContainsSString(SString s1, SString s2, SBool ignoringCase)
        {
            if (ignoringCase.Inner)
            {
                s1.Inner = s1.Inner.ToLower();
                s2.Inner = s2.Inner.ToLower();
            }

            return new SBool(s1.Inner.Contains(s2.Inner));
        }

        public static SString SStringToLower(SString s)
        {
            return new SString(s.Inner.ToLower());
        }

        public static SString SStringToUpper(SString s)
        {
            return new SString(s.Inner.ToUpper());
        }

        public static SString SStringTrim(SString s)
        {
            return new SString(s.Inner.Trim());
        }

        public static SStringList SStringSplit(SString s, SString separator)
        {
            return new SStringList(s.Inner.Split(separator.Inner).ToList());
        }

        public static SString SStringConcatSString(SString s1, SString s2)
        {
            return new SString(s1.Inner + s2.Inner);
        }

        public static SNumber SStringGetLength(SString s)
        {
            return new SNumber(s.Inner.Length);
        }

        #endregion

        #region SStringDict

        public static SBool SStringDictContainsKey(SStringDict sd, SString s)
        {
            return new SBool(sd.Inner.ContainsKey(s.Inner));
        }

        public static SBool SStringDictContainsValue(SStringDict sd, SString s)
        {
            return new SBool(sd.Inner.ContainsValue(s.Inner));
        }

        public static SBool SStringDictDoesNotContainKey(SStringDict sd, SString s)
        {
            return new SBool(!sd.Inner.ContainsKey(s.Inner));
        }

        public static SBool SStringDictDoesNotContainValue(SStringDict sd, SString s)
        {
            return new SBool(!sd.Inner.ContainsValue(s.Inner));
        }

        public static SBool SStringDictIsEmpty(SStringDict sd)
        {
            return new SBool(!sd.Inner.Any());
        }

        public static SBool SStringDictIsNotEmpty(SStringDict sd)
        {
            return new SBool(sd.Inner.Any());
        }

        public static SNumber SStringDictGetCount(SStringDict sd)
        {
            return new SNumber(sd.Inner.Count);
        }

        public static SString SStringDictGetValue(SStringDict sd, SString key)
        {
            return new SString(sd.Inner[key.Inner]);
        }

        #endregion

        #region SStringList

        public static SBool SStringListContainsSString(SStringList sl, SString s, SBool ignoringCase)
        {
            return new SBool(sl.Inner.Any(i => i.Equals(s.Inner, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool SStringListDoesNotContainSString(SStringList sl, SString s, SBool ignoringCase)
        {
            return new SBool(!sl.Inner.Any(i => i.Equals(s.Inner, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool SStringListIsEmpty(SStringList sl)
        {
            return new SBool(!sl.Inner.Any());
        }

        public static SBool SStringListIsNotEmpty(SStringList sl)
        {
            return new SBool(sl.Inner.Any());
        }

        public static SNumber SStringListGetCount(SStringList sl)
        {
            return new SNumber(sl.Inner.Count);
        }

        public static SString SStringListGetValue(SStringList sl, SNumber index)
        {
            return new SString(sl.Inner[(int) index.Inner]);
        }

        #endregion
    }
}