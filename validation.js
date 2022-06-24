/* ************************************ //
//  INITIAL INPUT VALIDATION FUNCTIONS  //
// ************************************ */

export default isValidExpression = (expression) => {
    const errorMsg = `${isValidInput(expression)[1]} ${isValidParenthesis(expression)[1]} ${isValidOperators(expression)[1]} ${isValidDecimals(expression)[1]}`;
    const isValid = isValidInput(expression)[0] && isValidParenthesis(expression)[0] && isValidOperators(expression)[0] && isValidDecimals(expression)[0];
    return [isValid, errorMsg];
}

const isValidInput = (expression) => {
    const invalidInputs = /[^-%!~\+\*\/\^\(\)\.\d]/g;
    const invalidArr = expression.match(invalidInputs);
    if(invalidArr) {
        return [false, "Error: Invalid entry. Please enter a valid mathematical expression."];
    } else {
        return [true, ''];
    }
}

const isValidParenthesis = (expression) => {
    const parentheses = expression.replace(/[^\(\)]/g, '');
    const matches = {
        ')':'(',
    };
    const arr = [];
    for(let index=0; index<parentheses.length; index++){
        if(parentheses[index]==='(') {
            arr.push(parentheses[index]);
        } else if(arr!==[] && arr[arr.length-1]===matches[parentheses[index]]) {
            arr.pop();
        } else{
            return [false, "Error: Invalid parentheses. Please enter a valid mathematical expression."];
        }
    }
    return (arr.length<1 ? [true, ''] : [false, "Error: Invalid parentheses. Please enter a valid mathematical expression."]);
}

const isValidOperators = (expression) => {
    const operators = ["+", "~", "*", "/", "^", "%"];
    const arr = expression.split('');
    for(let i=1; i<arr.length; i++) {
        // Cannot have two consecutive operators: "+/"
        if((operators.includes(arr[i-1]) && operators.includes(arr[i]))
            // Cannot have open parenthesis followed by an operator or factorial: "(+"
            || (arr[i-1]==='(' && (operators.includes(arr[i]) || arr[i]==="!"))
            // Cannot have an operator followed by a close parenthesis: "+)"
            || (operators.includes(arr[i-1]) && arr[i]===')')
            // Cannot have an operator followed by !: "+!"
            || (operators.includes(arr[i-1]) && arr[i]==='!')
            // Cannot have expression end with an operator that requires two operands
            || (operators.includes(arr[i]) && i===arr.length-1)
            // Cannot begin expression with an operand other than + or -
            || ('*^%/'.includes(arr[i-1]) && i===1)) {
            return [false, "Error: Invalid syntax. Please enter a valid mathematical expression."];
        }
    }
    return [true, ''];
}

const isValidDecimals = (expression) => {
    // Cannot have a factorial operate on a decimal
    if(expression.match(/[\d]+\.[\d]+!/g)
        // Cannot have more than one decimal in a number
        || expression.match(/\.[\d]*\./g)) {
        return [false, "Error: Invalid syntax. Please enter a valid mathematical expression."];
    }
    return [true, ''];
}

