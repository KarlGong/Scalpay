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
        value: ""
    },
    Duration: {
        returnType: DataType.Duration,
        expType: ExpType.Value,
        value: ""
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
        value: "string"
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
        }
    },
    DateTime: {},
    Duration: {},
    Number: {},
    NumberList: {},
    String: {},
    StringDict: {},
    StringList: {}
};