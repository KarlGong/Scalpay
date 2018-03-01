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

const boolDefaultExp = {
    returnType: "Bool",
    expType: ExpType.Value,
    value: true
};

export const Func = {
    Bool: {
        "BoolNot": {
            displayName: "not (Bool)",
            displayExp: "not {0}",
            funcArgs: [boolDefaultExp]
        },
        "BoolIsEqualToBool": {
            displayName: "(Bool) is equal to (Bool)",
            displayExp: "{0} = {1}",
            funcArgs: [boolDefaultExp, boolDefaultExp]
        },
        "BoolIsNotEqualToBool": {
            displayName: "(Bool) is not equal to (Bool)",
            displayExp: "{0} != {1}",
            funcArgs: [boolDefaultExp, boolDefaultExp]
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