import {ExpType} from "./store";

export function isVariableUsed(expression, variable) {
    if (!expression) return false;
    switch (expression.expType) {
        case ExpType.Var:
            return expression.var === variable;
        case ExpType.Value:
            return false;
        case ExpType.Func:
            for (let i = 0; i < expression.funcArgs.length; i++) {
                if (isVariableUsed(expression.funcArgs[i], variable)){
                    return true;
                }
            }
            return false;
    }
    return false;
}


export function updateVariable(expression, oldVariable, newVariable) {
    if (!expression) return;
    switch (expression.expType) {
        case ExpType.Var:
            if (expression.var === oldVariable) {
                expression.var = newVariable;
            }
            break;
        case ExpType.Func:
            expression.funcArgs.map(exp => {
                updateVariable(exp, oldVariable, newVariable);
            });
            break
    }
}