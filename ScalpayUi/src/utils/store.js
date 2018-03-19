import moment from "moment";

export const Privilege = {
    ProjectManage: "ProjectManage",
    ItemManage: "ItemManage",
    UserManage: "UserManage"
};

export const ItemMode = {
    Property: "Property",
    Raw: "Raw"
};

export const AuditType = {
    AddItem: "AddItem",
    UpdateItem: "UpdateItem",
    AddProject: "AddProject",
    UpdateProject: "UpdateProject",
};

export const ExpType = {
    Func: "Func",
    Value: "Value",
    Var: "Var"
};

export const DataType = {
    Bool: "Bool",
    DateTime: "DateTime",
    Duration: "Duration",
    Number: "Number",
    NumberList: "NumberList",
    String: "String",
    StringDict: "StringDict",
    StringList: "StringList"
};

export const DefaultExp = {
    Bool: {
        returnType: DataType.Bool,
        expType: ExpType.Value,
        value: true
    },
    DateTime: {
        returnType: DataType.DateTime,
        expType: ExpType.Value,
        value: moment.utc().format()
    },
    Duration: {
        returnType: DataType.Duration,
        expType: ExpType.Value,
        value: "P0Y0M0DT0H0M0S"
    },
    Number: {
        returnType: DataType.Number,
        expType: ExpType.Value,
        value: 0
    },
    NumberList: {
        returnType: DataType.NumberList,
        expType: ExpType.Value,
        value: []
    },
    String: {
        returnType: DataType.String,
        expType: ExpType.Value,
        value: ""
    },
    StringDict: {
        returnType: DataType.StringDict,
        expType: ExpType.Value,
        value: {}
    },
    StringList: {
        returnType: DataType.StringList,
        expType: ExpType.Value,
        value: []
    }
};

export const Func = {
    Bool: {
        "BoolNot": {
            displayName: "not (Bool)",
            displayExp: "not {0}",
            funcArgs: [DefaultExp.Bool]
        },
        "BoolIsEqualToBool": {
            displayName: "(Bool) is equal to (Bool)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.Bool, DefaultExp.Bool]
        },
        "BoolIsNotEqualToBool": {
            displayName: "(Bool) is not equal to (Bool)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.Bool, DefaultExp.Bool]
        },
        "DateTimeIsEqualToDateTime": {
            displayName: "(DateTime) is equal to (DateTime)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsNotEqualToDateTime": {
            displayName: "(DateTime) is not equal to (DateTime)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsAfterDateTime": {
            displayName: "(DateTime) is after (DateTime)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsBeforeDateTime": {
            displayName: "(DateTime) is before (DateTime)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsBetweenDateTimes": {
            displayName: "(DateTime) is between (Start) and (End)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DurationIsEqualToDuration": {
            displayName: "(Duration) is equal to (Duration)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.Duration, DefaultExp.Duration]
        },
        "DurationIsNotEqualToDuration": {
            displayName: "(Duration) is not equal to (Duration)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.Duration, DefaultExp.Duration]
        },
        "NumberIsEqualToNumber": {
            displayName: "(Number) is equal to (Number)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsNotEqualToNumber": {
            displayName: "(Number) is not equal to (Number)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsGreaterThenNumber": {
            displayName: "(Number) is greater then (Number)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsGreaterThenOrEqualToNumber": {
            displayName: "(Number) is greater then or equal to (Number)",
            displayExp: "{0} >= {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsLessThenNumber": {
            displayName: "(Number) is less then (Number)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsLessThenOrEqualToNumber": {
            displayName: "(Number) is less then or equal to (Number)",
            displayExp: "{0} <= {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsBetweenNumbers": {
            displayName: "(Number) is between (min) and (max)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number, DefaultExp.Number]
        },
        "NumberListContainsNumber": {
            displayName: "(NumberList) contains (Number)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.NumberList, DefaultExp.Number]
        },
        "NumberListDoesNotContainNumber": {
            displayName: "(NumberList) doesn't contain (Number)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.NumberList, DefaultExp.Number]
        },
        "NumberListIsEmpty": {
            displayName: "(NumberList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListIsNotEmpty": {
            displayName: "(NumberList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.NumberList]
        },
        "StringIsEqualToString": {
            displayName: "(String) is equal to (String)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringIsEqualToStringIgnoringCase": {
            displayName: "(String) is equal to (String) ignoring case",
            displayExp: "{0} ≈ {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringIsNotEqualToString": {
            displayName: "(String) is not equal to (String)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringIsNotEqualToStringIgnoringCase": {
            displayName: "(String) is not equal to (String) ignoring case",
            displayExp: "{0} !≈ {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringStartsWithString": {
            displayName: "(String) starts with (String)",
            displayExp: "{0} starts with {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringStartsWithStringIgnoringCase": {
            displayName: "(String) starts with (String) ignoring case",
            displayExp: "{0} starts with {1} ignoring case",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringContainsString": {
            displayName: "(String) contains (String)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringContainsStringIgnoringCase": {
            displayName: "(String) contains (String) ignoring case",
            displayExp: "{0} contains {1} ignoring case",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringDictContainsKey": {
            displayName: "(StringDict) contains key (String)",
            displayExp: "{0} contains key {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictDoesNotContainKey": {
            displayName: "(StringDict) doesn't contain key (String)",
            displayExp: "{0} doesn't contain key {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictContainsValue": {
            displayName: "(StringDict) contains value (String)",
            displayExp: "{0} contains value {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictDoesNotContainValue": {
            displayName: "(StringDict) doesn't contain value (String)",
            displayExp: "{0} doesn't contain value {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictIsEmpty": {
            displayName: "(StringDict) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.StringDict]
        },
        "StringDictIsNotEmpty": {
            displayName: "(StringDict) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.StringDict]
        },
        "StringListContainsString": {
            displayName: "(StringList) contains (String)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListContainsStringIgnoringCase": {
            displayName: "(StringList) contains (String) ignoring case",
            displayExp: "{0} contains {1} ignoring case",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListDoesNotContainString": {
            displayName: "(StringList) doesn't contain (String)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListDoesNotContainStringIgnoringCase": {
            displayName: "(StringList) doesn't contain (String) ignoring case",
            displayExp: "{0} doesn't contain {1} ignoring case",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListIsEmpty": {
            displayName: "(StringList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.StringList]
        },
        "StringListIsNotEmpty": {
            displayName: "(StringList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.StringList]
        },
    },
    DateTime: {
        "DateTimeAddYears": {
            displayName: "(DateTime) add years",
            displayExp: "{0} + {1} years",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddMonths": {
            displayName: "(DateTime) add months",
            displayExp: "{0} + {1} months",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddDays": {
            displayName: "(DateTime) add days",
            displayExp: "{0} + {1} days",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddHours": {
            displayName: "(DateTime) add hours",
            displayExp: "{0} + {1} hours",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddMinutes": {
            displayName: "(DateTime) add minutes",
            displayExp: "{0} + {1} minutes",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddSeconds": {
            displayName: "(DateTime) add seconds",
            displayExp: "{0} + {1} seconds",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Number]
        },
        "DateTimeAddSDuration": {
            displayName: "(DateTime) add duration",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.Duration]
        },
        "DateTimeNow": {
            displayName: "NOW",
            displayExp: "NOW",
            funcArgs: []
        },
    },
    Duration: {
        "DurationBetweenDateTimes": {
            displayName: "(DateTime) between (DateTime)",
            displayExp: "{0} - {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
    },
    Number: {
        "DateTimeGetYear": {
            displayName: "year of (DateTime)",
            displayExp: "year of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "DateTimeGetMonth": {
            displayName: "month of (DateTime)",
            displayExp: "month of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "DateTimeGetDay": {
            displayName: "day of (DateTime)",
            displayExp: "day of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "DateTimeGetHour": {
            displayName: "hour of (DateTime)",
            displayExp: "hour of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "DateTimeGetMinute": {
            displayName: "minute of (DateTime)",
            displayExp: "minute of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "DateTimeGetSecond": {
            displayName: "second of (DateTime)",
            displayExp: "second of {0}",
            funcArgs: [DefaultExp.DateTime]
        },
        "NumberAddNumber": {
            displayName: "(Number) add (Number)",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberMinusNumber": {
            displayName: "(Number) minus (Number)",
            displayExp: "{0} - {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberMultipliedByNumber": {
            displayName: "(Number) multiplied by (Number)",
            displayExp: "{0} * {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberDividedByNumber": {
            displayName: "(Number) divided by (Number)",
            displayExp: "{0} / {1}",
            funcArgs: [DefaultExp.Number, {
                returnType: DataType.Number,
                expType: ExpType.Value,
                value: 1
            }]
        },
        "NumberAbsolute": {
            displayName: "absolute value of (Number)",
            displayExp: "|{0}|",
            funcArgs: [DefaultExp.Number]
        },
        "NumberRound": {
            displayName: "round (Number)",
            displayExp: "round {0} with {1} digits",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberListGetCount": {
            displayName: "count of (NumberList)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListGetByIndex": {
            displayName: "nth of (NumberList)",
            displayExp: "{1}th of {0}",
            funcArgs: [DefaultExp.NumberList, {
                returnType: DataType.Number,
                expType: ExpType.Value,
                value: 1
            }]
        },
        "NumberListSum": {
            displayName: "sum of (NumberList)",
            displayExp: "sum of {0}",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListAverage": {
            displayName: "average of (NumberList)",
            displayExp: "average of {0}",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListMax": {
            displayName: "max of (NumberList)",
            displayExp: "max of {0}",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListMin": {
            displayName: "min of (NumberList)",
            displayExp: "min of {0}",
            funcArgs: [DefaultExp.NumberList]
        },
        "StringGetLength": {
            displayName: "length of (String)",
            displayExp: "length of {0}",
            funcArgs: [DefaultExp.String]
        },
        "StringDictGetCount": {
            displayName: "count of (StringDict)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.StringDict]
        },
        "StringListGetCount": {
            displayName: "count of (StringList)",
            displayExp: "count of {0}",
            funcArgs: [DefaultExp.StringList]
        },
    },
    NumberList: {},
    String: {
        "StringToLower": {
            displayName: "(String) to lowercase",
            displayExp: "{0} to lowercase",
            funcArgs: [DefaultExp.String]
        },
        "StringToUpper": {
            displayName: "(String) to uppercase",
            displayExp: "{0} to uppercase",
            funcArgs: [DefaultExp.String]
        },
        "StringTrim": {
            displayName: "trim (String)",
            displayExp: "trim {0}",
            funcArgs: [DefaultExp.String]
        },
        "StringConcatString": {
            displayName: "(String) concat (String)",
            displayExp: "{0} + {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
        "StringDictGetByKey": {
            displayName: "value for (String) in (StringDict)",
            displayExp: "value for {1} in {0}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringListGetByIndex": {
            displayName: "nth of (StringList)",
            displayExp: "{1}th of {0}",
            funcArgs: [DefaultExp.StringList, {
                returnType: DataType.Number,
                expType: ExpType.Value,
                value: 1
            }]
        },
    },
    StringDict: {},
    StringList: {
        "StringSplit": {
            displayName: "split (String) by (separator)",
            displayExp: "split {0} by {1}",
            funcArgs: [DefaultExp.String, DefaultExp.String]
        },
    }
};