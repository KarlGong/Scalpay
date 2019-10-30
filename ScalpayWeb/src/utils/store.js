import moment from "moment";

export const Role = {
    admin: "admin",
    user: "user"
};

export const ItemMode = {
    property: "property",
    raw: "raw"
};

export const AuditType = {
    addItem: "addItem",
    updateItem: "updateItem",
    addProject: "addProject",
    updateProject: "updateProject",
};

export const ExpType = {
    func: "func",
    value: "value",
    var: "var"
};

export const DataType = {
    bool: "bool",
    dateTime: "dateTime",
    duration: "duration",
    number: "number",
    numberList: "numberList",
    string: "string",
    stringDict: "stringDict",
    stringList: "stringList"
};

export const DefaultExp = {
    bool: {
        returnType: DataType.bool,
        expType: ExpType.value,
        value: true
    },
    dateTime: {
        returnType: DataType.dateTime,
        expType: ExpType.value,
        value: moment.utc().format()
    },
    duration: {
        returnType: DataType.duration,
        expType: ExpType.value,
        value: "P0Y0M0DT0H0M0S"
    },
    number: {
        returnType: DataType.number,
        expType: ExpType.value,
        value: 0
    },
    numberList: {
        returnType: DataType.numberList,
        expType: ExpType.value,
        value: []
    },
    string: {
        returnType: DataType.string,
        expType: ExpType.value,
        value: ""
    },
    stringDict: {
        returnType: DataType.stringDict,
        expType: ExpType.value,
        value: {}
    },
    stringList: {
        returnType: DataType.stringList,
        expType: ExpType.value,
        value: []
    }
};

export const Func = {
    bool: {
        "BoolNot": {
            displayName: "not (Bool)",
            displayExp: "not {0}",
            funcArgs: [DefaultExp.bool]
        },
        "BoolIsEqualToBool": {
            displayName: "(Bool) is equal to (Bool)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.bool, DefaultExp.bool]
        },
        "BoolIsNotEqualToBool": {
            displayName: "(Bool) is not equal to (Bool)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.bool, DefaultExp.bool]
        },
        "SBoolAndSBool": {
            displayName: "(Bool) and (Bool)",
            displayExp: "{0} and {1}",
            funcArgs: [DefaultExp.bool, DefaultExp.bool]
        },
        "SBoolOrSBool": {
            displayName: "(Bool) or (Bool)",
            displayExp: "{0} or {1}",
            funcArgs: [DefaultExp.bool, DefaultExp.bool]
        },
        "DateTimeIsEqualToDateTime": {
            displayName: "(DateTime) is equal to (DateTime)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime]
        },
        "DateTimeIsNotEqualToDateTime": {
            displayName: "(DateTime) is not equal to (DateTime)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime]
        },
        "DateTimeIsAfterDateTime": {
            displayName: "(DateTime) is after (DateTime)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime]
        },
        "DateTimeIsBeforeDateTime": {
            displayName: "(DateTime) is before (DateTime)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime]
        },
        "DateTimeIsBetweenDateTimes": {
            displayName: "(DateTime) is between (Start) and (End)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime, DefaultExp.dateTime]
        },
        "DurationIsEqualToDuration": {
            displayName: "(Duration) is equal to (Duration)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.duration, DefaultExp.duration]
        },
        "DurationIsNotEqualToDuration": {
            displayName: "(Duration) is not equal to (Duration)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.duration, DefaultExp.duration]
        },
        "NumberIsEqualToNumber": {
            displayName: "(Number) is equal to (Number)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsNotEqualToNumber": {
            displayName: "(Number) is not equal to (Number)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsGreaterThenNumber": {
            displayName: "(Number) is greater then (Number)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsGreaterThenOrEqualToNumber": {
            displayName: "(Number) is greater then or equal to (Number)",
            displayExp: "{0} >= {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsLessThenNumber": {
            displayName: "(Number) is less then (Number)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsLessThenOrEqualToNumber": {
            displayName: "(Number) is less then or equal to (Number)",
            displayExp: "{0} <= {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberIsBetweenNumbers": {
            displayName: "(Number) is between (min) and (max)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.number, DefaultExp.number, DefaultExp.number]
        },
        "NumberListContainsNumber": {
            displayName: "(NumberList) contains (Number)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.numberList, DefaultExp.number]
        },
        "NumberListDoesNotContainNumber": {
            displayName: "(NumberList) doesn't contain (Number)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.numberList, DefaultExp.number]
        },
        "NumberListIsEmpty": {
            displayName: "(NumberList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.numberList]
        },
        "NumberListIsNotEmpty": {
            displayName: "(NumberList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.numberList]
        },
        "StringIsEqualToString": {
            displayName: "(String) is equal to (String)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringIsEqualToStringIgnoringCase": {
            displayName: "(String) is equal to (String) ignoring case",
            displayExp: "{0} ≈ {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringIsNotEqualToString": {
            displayName: "(String) is not equal to (String)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringIsNotEqualToStringIgnoringCase": {
            displayName: "(String) is not equal to (String) ignoring case",
            displayExp: "{0} !≈ {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringStartsWithString": {
            displayName: "(String) starts with (String)",
            displayExp: "{0} starts with {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringStartsWithStringIgnoringCase": {
            displayName: "(String) starts with (String) ignoring case",
            displayExp: "{0} starts with {1} ignoring case",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringContainsString": {
            displayName: "(String) contains (String)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringContainsStringIgnoringCase": {
            displayName: "(String) contains (String) ignoring case",
            displayExp: "{0} contains {1} ignoring case",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringDictContainsKey": {
            displayName: "(StringDict) contains key (String)",
            displayExp: "{0} contains key {1}",
            funcArgs: [DefaultExp.stringDict, DefaultExp.string]
        },
        "StringDictDoesNotContainKey": {
            displayName: "(StringDict) doesn't contain key (String)",
            displayExp: "{0} doesn't contain key {1}",
            funcArgs: [DefaultExp.stringDict, DefaultExp.string]
        },
        "StringDictContainsValue": {
            displayName: "(StringDict) contains value (String)",
            displayExp: "{0} contains value {1}",
            funcArgs: [DefaultExp.stringDict, DefaultExp.string]
        },
        "StringDictDoesNotContainValue": {
            displayName: "(StringDict) doesn't contain value (String)",
            displayExp: "{0} doesn't contain value {1}",
            funcArgs: [DefaultExp.stringDict, DefaultExp.string]
        },
        "StringDictIsEmpty": {
            displayName: "(StringDict) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.stringDict]
        },
        "StringDictIsNotEmpty": {
            displayName: "(StringDict) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.stringDict]
        },
        "StringListContainsString": {
            displayName: "(StringList) contains (String)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.stringList, DefaultExp.string]
        },
        "StringListContainsStringIgnoringCase": {
            displayName: "(StringList) contains (String) ignoring case",
            displayExp: "{0} contains {1} ignoring case",
            funcArgs: [DefaultExp.stringList, DefaultExp.string]
        },
        "StringListDoesNotContainString": {
            displayName: "(StringList) doesn't contain (String)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.stringList, DefaultExp.string]
        },
        "StringListDoesNotContainStringIgnoringCase": {
            displayName: "(StringList) doesn't contain (String) ignoring case",
            displayExp: "{0} doesn't contain {1} ignoring case",
            funcArgs: [DefaultExp.stringList, DefaultExp.string]
        },
        "StringListIsEmpty": {
            displayName: "(StringList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.stringList]
        },
        "StringListIsNotEmpty": {
            displayName: "(StringList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.stringList]
        },
    },
    dateTime: {
        "DateTimeAddYears": {
            displayName: "(DateTime) add years",
            displayExp: "{0} + {1} years",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddMonths": {
            displayName: "(DateTime) add months",
            displayExp: "{0} + {1} months",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddDays": {
            displayName: "(DateTime) add days",
            displayExp: "{0} + {1} days",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddHours": {
            displayName: "(DateTime) add hours",
            displayExp: "{0} + {1} hours",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddMinutes": {
            displayName: "(DateTime) add minutes",
            displayExp: "{0} + {1} minutes",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddSeconds": {
            displayName: "(DateTime) add seconds",
            displayExp: "{0} + {1} seconds",
            funcArgs: [DefaultExp.dateTime, DefaultExp.number]
        },
        "DateTimeAddSDuration": {
            displayName: "(DateTime) add duration",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.duration]
        },
        "DateTimeNow": {
            displayName: "NOW",
            displayExp: "NOW",
            funcArgs: []
        },
    },
    duration: {
        "DurationBetweenDateTimes": {
            displayName: "(DateTime) between (DateTime)",
            displayExp: "{0} - {1}",
            funcArgs: [DefaultExp.dateTime, DefaultExp.dateTime]
        },
    },
    number: {
        "DateTimeGetYear": {
            displayName: "year of (DateTime)",
            displayExp: "year of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "DateTimeGetMonth": {
            displayName: "month of (DateTime)",
            displayExp: "month of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "DateTimeGetDay": {
            displayName: "day of (DateTime)",
            displayExp: "day of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "DateTimeGetHour": {
            displayName: "hour of (DateTime)",
            displayExp: "hour of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "DateTimeGetMinute": {
            displayName: "minute of (DateTime)",
            displayExp: "minute of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "DateTimeGetSecond": {
            displayName: "second of (DateTime)",
            displayExp: "second of {0}",
            funcArgs: [DefaultExp.dateTime]
        },
        "NumberAddNumber": {
            displayName: "(Number) add (Number)",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberMinusNumber": {
            displayName: "(Number) minus (Number)",
            displayExp: "{0} - {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberMultipliedByNumber": {
            displayName: "(Number) multiplied by (Number)",
            displayExp: "{0} * {1}",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberDividedByNumber": {
            displayName: "(Number) divided by (Number)",
            displayExp: "{0} / {1}",
            funcArgs: [DefaultExp.number, {
                returnType: DataType.number,
                expType: ExpType.value,
                value: 1
            }]
        },
        "NumberAbsolute": {
            displayName: "absolute value of (Number)",
            displayExp: "|{0}|",
            funcArgs: [DefaultExp.number]
        },
        "NumberRound": {
            displayName: "round (Number)",
            displayExp: "round {0} with {1} digits",
            funcArgs: [DefaultExp.number, DefaultExp.number]
        },
        "NumberListGetCount": {
            displayName: "count of (NumberList)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.numberList]
        },
        "NumberListGetByIndex": {
            displayName: "nth of (NumberList)",
            displayExp: "{1}th of {0}",
            funcArgs: [DefaultExp.numberList, {
                returnType: DataType.number,
                expType: ExpType.value,
                value: 1
            }]
        },
        "NumberListSum": {
            displayName: "sum of (NumberList)",
            displayExp: "sum of {0}",
            funcArgs: [DefaultExp.numberList]
        },
        "NumberListAverage": {
            displayName: "average of (NumberList)",
            displayExp: "average of {0}",
            funcArgs: [DefaultExp.numberList]
        },
        "NumberListMax": {
            displayName: "max of (NumberList)",
            displayExp: "max of {0}",
            funcArgs: [DefaultExp.numberList]
        },
        "NumberListMin": {
            displayName: "min of (NumberList)",
            displayExp: "min of {0}",
            funcArgs: [DefaultExp.numberList]
        },
        "StringGetLength": {
            displayName: "length of (String)",
            displayExp: "length of {0}",
            funcArgs: [DefaultExp.string]
        },
        "StringDictGetCount": {
            displayName: "count of (StringDict)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.stringDict]
        },
        "StringListGetCount": {
            displayName: "count of (StringList)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.stringList]
        },
    },
    numberList: {},
    string: {
        "StringToLower": {
            displayName: "(String) to lowercase",
            displayExp: "{0} to lowercase",
            funcArgs: [DefaultExp.string]
        },
        "StringToUpper": {
            displayName: "(String) to uppercase",
            displayExp: "{0} to uppercase",
            funcArgs: [DefaultExp.string]
        },
        "StringTrim": {
            displayName: "trim (String)",
            displayExp: "trim {0}",
            funcArgs: [DefaultExp.string]
        },
        "StringConcatString": {
            displayName: "(String) concat (String)",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
        "StringDictGetByKey": {
            displayName: "value for (String) in (StringDict)",
            displayExp: "value for {1} in {0}",
            funcArgs: [DefaultExp.stringDict, DefaultExp.string]
        },
        "StringListGetByIndex": {
            displayName: "nth of (StringList)",
            displayExp: "{1}th of {0}",
            funcArgs: [DefaultExp.stringList, {
                returnType: DataType.number,
                expType: ExpType.value,
                value: 1
            }]
        },
    },
    stringDict: {},
    stringList: {
        "StringSplit": {
            displayName: "split (String) by (separator)",
            displayExp: "split {0} by {1}",
            funcArgs: [DefaultExp.string, DefaultExp.string]
        },
    }
};