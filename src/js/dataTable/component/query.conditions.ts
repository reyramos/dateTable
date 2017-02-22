/**
 * Created by ramor11 on 12/8/2016.
 */


export const QUERY_OPERATORS: Array<any> = [{name: 'AND'}, {name: 'OR'}];


export const QUERY_CONDITIONS: any = {
    EQUAL        : {
        name  : "Equal",
        value : "EQ",
        symbol: ["equal", "==", "=", "<=>"] //THIS CAN BE AN ARRAY OF POSSIBLE SYMBOLS
    },
    NOT_EQUAL    : {
        name  : "Not Equal",
        value : "NE",
        symbol: ["not_equal", "not equal", "!==", "!=", "<>"] //THIS CAN BE AN ARRAY OF POSSIBLE SYMBOLS
    },
    GREATER_THAN : {
        name  : "Greater Than",
        value : "GT",
        symbol: ["greater_than", ">"]
    },
    GREATER_EQUAL: {
        name  : "Greater or Equal",
        value : "GE",
        symbol: ["greater_or_equal", ">="]
    },
    LESS_THAN    : {
        name  : "Less Than",
        value : "LT",
        symbol: ["less_than", "<"]
    },
    LESS_EQUAL   : {
        name  : "Less or Equal",
        value : "LE",
        symbol: ["less_or_equal", "<="]
    },
    IN           : {
        name  : "In",
        value : "IN",
        symbol: "IN"
    },
    BETWEEN      : {
        name  : "Between",
        value : "BETWEEN",
        symbol: "BETWEEN"
    },
    // NOT_BETWEEN: {
    //     name: "Not Between",
    //     value: "NOT_BETWEEN",
    //     symbol: "not between"
    // },
    CONTAINS     : {
        name  : "Contains",
        value : "CONTAINS",
        //not implement LIKE %%  WIP
        symbol: ["contains", "LIKE `%{{VALUES}}%`"]
    },
    NOT_CONTAINS : {
        name  : "Not Contains",
        value : "NOT_CONTAINS",
        symbol: ["not_contains", "NOT CONTAINS", "NOT LIKE `%{{VALUES}}%`"]
    },
    STARTS_WITH  : {
        name  : "Starts With",
        value : "STARTS_WITH",
        symbol: ["starts_with", "STARTS WITH", "LIKE `%{{VALUES}}`"]
    },
    ENDS_WITH    : {
        name  : "Ends With",
        value : "ENDS_WITH",
        symbol: ["ends_with", "ENDS WITH", "LIKE `{{VALUES}}%`"]
    }
};

