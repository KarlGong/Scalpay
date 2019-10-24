import {ExpType} from "./store";

export function isVariableUsed(expression, variable) {
    if (!expression) return false;
    switch (expression.expType) {
        case ExpType.var:
            return expression.var === variable;
        case ExpType.value:
            return false;
        case ExpType.func:
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
        case ExpType.var:
            if (expression.var === oldVariable) {
                expression.var = newVariable;
            }
            break;
        case ExpType.func:
            expression.funcArgs.map(exp => {
                updateVariable(exp, oldVariable, newVariable);
            });
            break
    }
}