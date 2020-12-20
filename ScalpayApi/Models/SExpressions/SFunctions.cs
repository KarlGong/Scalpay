using System;
using System.Linq;

namespace Scalpay.Models.SExpressions
{
    public class SFunctions
    {
        #region SBool

        public static SBool BoolNot(SBool b)
        {
            return new SBool(!b.Value);
        }

        public static SBool BoolIsEqualToBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Value == b2.Value);
        }

        public static SBool BoolIsNotEqualToBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Value != b2.Value);
        }

        public static SBool SBoolAndSBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Value && b2.Value);
        }
        
        public static SBool SBoolOrSBool(SBool b1, SBool b2)
        {
            return new SBool(b1.Value || b2.Value);
        }

        #endregion

        #region SDateTime

        public static SBool DateTimeIsEqualToDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Value == d2.Value);
        }

        public static SBool DateTimeIsNotEqualToDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Value != d2.Value);
        }

        public static SBool DateTimeIsAfterDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Value > d2.Value);
        }

        public static SBool DateTimeIsBeforeDateTime(SDateTime d1, SDateTime d2)
        {
            return new SBool(d1.Value < d2.Value);
        }

        public static SBool DateTimeIsBetweenDateTimes(SDateTime d, SDateTime start, SDateTime end)
        {
            return new SBool(d.Value >= start.Value && d.Value <= end.Value);
        }

        public static SDateTime DateTimeAddYears(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddYears((int) n.Value));
        }

        public static SDateTime DateTimeAddMonths(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddMonths((int) n.Value));
        }

        public static SDateTime DateTimeAddDays(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddDays(n.Value));
        }

        public static SDateTime DateTimeAddHours(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddHours(n.Value));
        }

        public static SDateTime DateTimeAddMinutes(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddMinutes(n.Value));
        }

        public static SDateTime DateTimeAddSeconds(SDateTime d, SNumber n)
        {
            return new SDateTime(d.Value.AddSeconds(n.Value));
        }

        public static SDateTime DateTimeAddSDuration(SDateTime d, SDuration du)
        {
            return new SDateTime(d.Value.Add(du.Value));
        }

        public static SNumber DateTimeGetYear(SDateTime d)
        {
            return new SNumber(d.Value.Year);
        }

        public static SNumber DateTimeGetMonth(SDateTime d)
        {
            return new SNumber(d.Value.Month);
        }

        public static SNumber DateTimeGetDay(SDateTime d)
        {
            return new SNumber(d.Value.Day);
        }

        public static SNumber DateTimeGetHour(SDateTime d)
        {
            return new SNumber(d.Value.Hour);
        }

        public static SNumber DateTimeGetMinute(SDateTime d)
        {
            return new SNumber(d.Value.Minute);
        }

        public static SNumber DateTimeGetSecond(SDateTime d)
        {
            return new SNumber(d.Value.Second);
        }

        public static SDateTime DateTimeNow()
        {
            return new SDateTime(DateTime.UtcNow);
        }

        #endregion

        #region SDuration

        public static SBool DurationIsEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Value == du2.Value);
        }

        public static SBool DurationIsNotEqualToDuration(SDuration du1, SDuration du2)
        {
            return new SBool(du1.Value != du2.Value);
        }

        public static SDuration DurationBetweenDateTimes(SDateTime d1, SDateTime d2)
        {
            return new SDuration(d1.Value - d2.Value);
        }

        #endregion

        #region SNumber

        public static SBool NumberIsEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value == n2.Value);
        }

        public static SBool NumberIsNotEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value != n2.Value);
        }

        public static SBool NumberIsGreaterThenNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value > n2.Value);
        }

        public static SBool NumberIsGreaterThenOrEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value >= n2.Value);
        }

        public static SBool NumberIsLessThenNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value < n2.Value);
        }

        public static SBool NumberIsLessThenOrEqualToNumber(SNumber n1, SNumber n2)
        {
            return new SBool(n1.Value <= n2.Value);
        }
        
        public static SBool NumberIsBetweenNumbers(SNumber d, SNumber min, SNumber max)
        {
            return new SBool(d.Value >= min.Value && d.Value <= max.Value);
        }

        public static SNumber NumberAddNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Value + n2.Value);
        }

        public static SNumber NumberMinusNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Value - n2.Value);
        }

        public static SNumber NumberMultipliedByNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Value * n2.Value);
        }

        public static SNumber NumberDividedByNumber(SNumber n1, SNumber n2)
        {
            return new SNumber(n1.Value / n2.Value);
        }

        public static SNumber NumberAbsolute(SNumber n)
        {
            return new SNumber(Math.Abs(n.Value));
        }

        public static SNumber NumberRound(SNumber n, SNumber digits)
        {
            return new SNumber(Math.Round(n.Value, (int) digits.Value));
        }

        #endregion

        #region SNumberList

        public static SBool NumberListContainsNumber(SNumberList nl, SNumber n)
        {
            return new SBool(nl.Value.Contains(n.Value));
        }

        public static SBool NumberListDoesNotContainNumber(SNumberList nl, SNumber n)
        {
            return new SBool(!nl.Value.Contains(n.Value));
        }

        public static SBool NumberListIsEmpty(SNumberList nl)
        {
            return new SBool(!nl.Value.Any());
        }

        public static SBool NumberListIsNotEmpty(SNumberList nl)
        {
            return new SBool(nl.Value.Any());
        }

        public static SNumber NumberListGetCount(SNumberList nl)
        {
            return new SNumber(nl.Value.Count);
        }

        public static SNumber NumberListGetByIndex(SNumberList nl, SNumber index)
        {
            return new SNumber(nl.Value[(int) index.Value - 1]);
        }

        public static SNumber NumberListSum(SNumberList nl)
        {
            return new SNumber(nl.Value.Sum());
        }

        public static SNumber NumberListAverage(SNumberList nl)
        {
            return new SNumber(nl.Value.Average());
        }

        public static SNumber NumberListMax(SNumberList nl)
        {
            return new SNumber(nl.Value.Max());
        }

        public static SNumber NumberListMin(SNumberList nl)
        {
            return new SNumber(nl.Value.Min());
        }

        #endregion

        #region SString

        public static SBool StringIsEqualToString(SString s1, SString s2)
        {
            return new SBool(string.Equals(s1.Value, s2.Value, StringComparison.Ordinal));
        }

        public static SBool StringIsEqualToStringIgnoringCase(SString s1, SString s2)
        {
            return new SBool(string.Equals(s1.Value, s2.Value, StringComparison.OrdinalIgnoreCase));
        }
        
        public static SBool StringIsNotEqualToString(SString s1, SString s2)
        {
            return new SBool(!string.Equals(s1.Value, s2.Value, StringComparison.Ordinal));
        }

        public static SBool StringIsNotEqualToStringIgnoringCase(SString s1, SString s2)
        {
            return new SBool(!string.Equals(s1.Value, s2.Value, StringComparison.OrdinalIgnoreCase));
        }

        public static SBool StringStartsWithString(SString s1, SString s2)
        {
            return new SBool(s1.Value.StartsWith(s2.Value, StringComparison.Ordinal));
        }
        
        public static SBool StringStartsWithStringIgnoringCase(SString s1, SString s2)
        {
            return new SBool(s1.Value.StartsWith(s2.Value, StringComparison.OrdinalIgnoreCase));
        }

        public static SBool StringContainsString(SString s1, SString s2)
        {

            return new SBool(s1.Value.IndexOf(s2.Value, StringComparison.Ordinal) >= 0);
        }
        
        public static SBool StringContainsStringIgnoringCase(SString s1, SString s2)
        {

            return new SBool(s1.Value.IndexOf(s2.Value, StringComparison.OrdinalIgnoreCase) >= 0);
        }

        public static SString StringToLower(SString s)
        {
            return new SString(s.Value.ToLower());
        }

        public static SString StringToUpper(SString s)
        {
            return new SString(s.Value.ToUpper());
        }

        public static SString StringTrim(SString s)
        {
            return new SString(s.Value.Trim());
        }

        public static SStringList StringSplit(SString s, SString separator)
        {
            return new SStringList(s.Value.Split(separator.Value).ToList());
        }

        public static SString StringConcatString(SString s1, SString s2)
        {
            return new SString(s1.Value + s2.Value);
        }

        public static SNumber StringGetLength(SString s)
        {
            return new SNumber(s.Value.Length);
        }

        #endregion

        #region SStringDict

        public static SBool StringDictContainsKey(SStringDict sd, SString s)
        {
            return new SBool(sd.Value.ContainsKey(s.Value));
        }

        public static SBool StringDictDoesNotContainKey(SStringDict sd, SString s)
        {
            return new SBool(!sd.Value.ContainsKey(s.Value));
        }

        public static SBool StringDictContainsValue(SStringDict sd, SString s)
        {
            return new SBool(sd.Value.ContainsValue(s.Value));
        }

        public static SBool StringDictDoesNotContainValue(SStringDict sd, SString s)
        {
            return new SBool(!sd.Value.ContainsValue(s.Value));
        }

        public static SBool StringDictIsEmpty(SStringDict sd)
        {
            return new SBool(!sd.Value.Any());
        }

        public static SBool StringDictIsNotEmpty(SStringDict sd)
        {
            return new SBool(sd.Value.Any());
        }

        public static SNumber StringDictGetCount(SStringDict sd)
        {
            return new SNumber(sd.Value.Count);
        }

        public static SString StringDictGetByKey(SStringDict sd, SString key)
        {
            return new SString(sd.Value[key.Value]);
        }

        #endregion

        #region SStringList

        public static SBool StringListContainsString(SStringList sl, SString s)
        {
            return new SBool(sl.Value.Any(i => i.Equals(s.Value, StringComparison.Ordinal)));
        }
        
        public static SBool StringListContainsStringIgnoringCase(SStringList sl, SString s)
        {
            return new SBool(sl.Value.Any(i => i.Equals(s.Value, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool StringListDoesNotContainString(SStringList sl, SString s)
        {
            return new SBool(!sl.Value.Any(i => i.Equals(s.Value, StringComparison.Ordinal)));
        }
        
        public static SBool StringListDoesNotContainStringIgnoringCase(SStringList sl, SString s)
        {
            return new SBool(!sl.Value.Any(i => i.Equals(s.Value, StringComparison.OrdinalIgnoreCase)));
        }

        public static SBool StringListIsEmpty(SStringList sl)
        {
            return new SBool(!sl.Value.Any());
        }

        public static SBool StringListIsNotEmpty(SStringList sl)
        {
            return new SBool(sl.Value.Any());
        }

        public static SNumber StringListGetCount(SStringList sl)
        {
            return new SNumber(sl.Value.Count);
        }

        public static SString StringListGetByIndex(SStringList sl, SNumber index)
        {
            return new SString(sl.Value[(int) index.Value - 1]);
        }

        #endregion
    }
}