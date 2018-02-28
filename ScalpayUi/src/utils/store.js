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
    Lookup: "Lookup",
    Word: "Word"
};

export const ItemMode = {
    ConfigProperty: "ConfigProperty",
    ConfigRaw: "ConfigRaw"
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

export const Func = {
    Bool: [
        {
            name: "BoolNot",
            displayName: "not (Bool)",
            exp: "not {Bool::0}"
        },
        {
            name: "BoolIsEqualToBool",
            displayName: "(Bool) is equal to (Bool)",
            exp: "{Bool::0} = {Bool::1}"
        },
        {
            name: "BoolIsNotEqualToBool",
            displayName: "(Bool) is not equal to (Bool)",
            exp: "{Bool::0} != {Bool::1}"
        }
    ],
    DateTime: [

    ],
    Duration:[

    ],
    Number: [

    ],
    NumberList: [

    ],
    String: [

    ],
    StringDict: [

    ],
    StringList:[

    ]
};