import moment from "moment";

export const Privilege = {
    ProjectAdd: "ProjectAdd",
    ProjectEdit: "ProjectEdit",
    ProjectDelete: "ProjectDelete",
    ItemAdd: "ItemAdd",
    ItemEdit: "ItemEdit",
    ItemDelete: "ItemDelete",
    UserManage: "UserManage"
};

export const ItemType = {
    Config: "Config",
    Word: "Word"
};

export const ConfigItemMode = {
    Property: "Property",
    Raw: "Raw"
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
        "DateTimeIsEqualToDateTime" : {
            displayName: "(DateTime) is equal to (DateTime)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsNotEqualToDateTime" : {
            displayName: "(DateTime) is not equal to (DateTime)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsAfterDateTime" : {
            displayName: "(DateTime) is after (DateTime)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsBeforeDateTime" : {
            displayName: "(DateTime) is before (DateTime)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DateTimeIsBetweenDateTimes" : {
            displayName: "(DateTime) is between (Start) and (End)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.DateTime, DefaultExp.DateTime, DefaultExp.DateTime]
        },
        "DurationIsEqualToDuration" : {
            displayName: "(Duration) is equal to (Duration)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.Duration, DefaultExp.Duration]
        },
        "DurationIsNotEqualToDuration" : {
            displayName: "(Duration) is not equal to (Duration)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.Duration, DefaultExp.Duration]
        },
        "NumberIsEqualToNumber" : {
            displayName: "(Number) = (Number)",
            displayExp: "{0} = {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsNotEqualToNumber" : {
            displayName: "(Number) != (Number)",
            displayExp: "{0} != {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsGreaterThenNumber" : {
            displayName: "(Number) > (Number)",
            displayExp: "{0} > {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsGreaterThenOrEqualToNumber" : {
            displayName: "(Number) >= (Number)",
            displayExp: "{0} >= {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsLessThenNumber" : {
            displayName: "(Number) < (Number)",
            displayExp: "{0} < {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsLessThenOrEqualToNumber" : {
            displayName: "(Number) <= (Number)",
            displayExp: "{0} <= {1}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number]
        },
        "NumberIsBetweenNumbers" : {
            displayName: "(Number) is between (min) and (max)",
            displayExp: "{0} is between {1} and {2}",
            funcArgs: [DefaultExp.Number, DefaultExp.Number, DefaultExp.Number]
        },
        "NumberListContainsNumber" : {
            displayName: "(NumberList) contains (Number)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.NumberList, DefaultExp.Number]
        },
        "NumberListDoesNotContainNumber" : {
            displayName: "(NumberList) doesn't contain (Number)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.NumberList, DefaultExp.Number]
        },
        "NumberListIsEmpty" : {
            displayName: "(NumberList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.NumberList]
        },
        "NumberListIsNotEmpty" : {
            displayName: "(NumberList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.NumberList]
        },
        "StringIsEqualToString" : {
            displayName: "(String) is equal to (String)",
            displayExp: "{0} is equal to {1}, ignoring case {2}",
            funcArgs: [DefaultExp.String, DefaultExp.String, DefaultExp.Bool]
        },
        "StringIsNotEqualToString" : {
            displayName: "(String) is not equal to (String)",
            displayExp: "{0} is not equal to {1}, ignoring case {2}",
            funcArgs: [DefaultExp.String, DefaultExp.String, DefaultExp.Bool]
        },
        "StringStartsWithString" : {
            displayName: "(String) starts with (String)",
            displayExp: "{0} starts with {1}, ignoring case {2}",
            funcArgs: [DefaultExp.String, DefaultExp.String, DefaultExp.Bool]
        },
        "StringContainsString" : {
            displayName: "(String) contains (String)",
            displayExp: "{0} contains {1}, ignoring case {2}",
            funcArgs: [DefaultExp.String, DefaultExp.String, DefaultExp.Bool]
        },
        "StringDictContainsKey" : {
            displayName: "(StringDict) contains key (String)",
            displayExp: "{0} contains key {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictDoesNotContainKey" : {
            displayName: "(StringDict) doesn't contain key (String)",
            displayExp: "{0} doesn't contain key {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictContainsValue" : {
            displayName: "(StringDict) contains value (String)",
            displayExp: "{0} contains value {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictDoesNotContainValue" : {
            displayName: "(StringDict) doesn't contain value (String)",
            displayExp: "{0} doesn't contain value {1}",
            funcArgs: [DefaultExp.StringDict, DefaultExp.String]
        },
        "StringDictIsEmpty" : {
            displayName: "(StringDict) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.StringDict]
        },
        "StringDictIsNotEmpty" : {
            displayName: "(StringDict) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.StringDict]
        },
        "StringListContainsString" : {
            displayName: "(StringList) contains (String)",
            displayExp: "{0} contains {1}",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListDoesNotContainString" : {
            displayName: "(StringList) doesn't contain (String)",
            displayExp: "{0} doesn't contain {1}",
            funcArgs: [DefaultExp.StringList, DefaultExp.String]
        },
        "StringListIsEmpty" : {
            displayName: "(StringList) is empty",
            displayExp: "{0} is empty",
            funcArgs: [DefaultExp.StringList]
        },
        "StringListIsNotEmpty" : {
            displayName: "(StringList) is not empty",
            displayExp: "{0} is not empty",
            funcArgs: [DefaultExp.StringList]
        },
    },
    DateTime: {},
    Duration: {},
    Number: {},
    NumberList: {},
    String: {},
    StringDict: {},
    StringList: {}
};