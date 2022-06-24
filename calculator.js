
/* ************************************ //
//         CALCULATE FUNCTION           //
// ************************************ */

export default calculate = (expression) => {
    expression = implicitToExplicitMultiplication(expression);
    expression = prepNegatives(expression);
    let expressionStr = `${expression}`;

    // handle Parentheses
    if(expressionStr.includes('(')) {
        expressionStr = handleParenthesis(expressionStr);
    }

    // handle Factorials
    if(expressionStr.includes('!')) {
        expressionStr = handleFactorials(expressionStr);
    }

    // handle Exponents
    if(expressionStr.includes('^')) {
        expressionStr = handleExponents(expressionStr);
    }

    // handle Multiplication and Division (in order from left to right)
    if(expressionStr.includes('*') || expressionStr.includes('/')) {
        expressionStr = handleMultiplicationDivision(expressionStr);
        if(`${expressionStr}`.includes("Error")) return "Error: Are you trying to implode the universe? Dividing by zero is not allowed.";
    }

    // handle Addition and Subtraction (in order from left to right)
    if((expressionStr.includes('+') || expressionStr.includes('~')) && !expressionStr.includes('e')) {
        expressionStr = handleAdditionSubtraction(expressionStr);
    }
    
    return Number(Number(expressionStr).toFixed(2));
}

/* ************************************ //
//         OPERATION FUNCTIONS          //
// ************************************ */

const operate = (operator, value1, value2) => {
    const a = Number(value1), b = Number(value2);
    switch (operator) {
        case "+":
            return a + b;
            break;
        case "~":
            return a - b;
            break;
        case "*":
            return a * b;
            break;
        case "/":
            if(b===0) {
                console.log("Error: Are you trying to implode the universe? Dividing by zero is not allowed.");
                return "Error";
            } else return (a/b).toFixed(10);
            break;
        case "^":
            return Math.pow(a, b);
            break;
        case "!":
            let factorialResult = 1;
            for(let i=1; i<=a; i++) {
                factorialResult *= i;
            }
            if(a>=0) {
                return factorialResult;
            } else {
                return undefined;
            }
            break;
        default:
            break;
    }
}

const handleParenthesis = (expression) => {
    let expressionStr = `${expression}`.replace(/[\(]/g, " (").replace(/[\)]/g, ") ");
    const inputArr = expressionStr
        .split(' ')
        .map((element) => {
            // If a complete expression contained within () exists, strip the (), evaluate the expression and replace the () expression with its result in inputArr
            if(element.match(/^\(.*\)$/)) {
                element = `${element}`.substring(1, element.length-1);
                return calculate(element);
            } else return element;
        });
    expressionStr = inputArr.join('');
    // If a set of outer () exists after inner () are evaluated, handle those ()
    if(expressionStr.includes('(') && !expressionStr.includes("Error")) {
        expressionStr = handleParenthesis(expressionStr);
    }
    // Return once all inner and outer () have been handled
    return `${expressionStr}`;
}

const handleFactorials = (expression) => {
    let expressionStr = '';
    // Validate that only digits, decimals, !, ^, *, /, ~, +, and - are used in expression
    if(expression.match(/[^-!~\d\+\/\*\^\.]/g)) { // Invalid
        console.log(`Error: Invalid input in handleFactorials function: ${expression}`);
    } else if(!expression.match(/[^-!\d]/g)) { // If only digits/decimals and ! are present
        expressionStr = `${expression}`.replace(/[\d]+!/, (x) => {
            return `${x} `
        });
        const inputArr = expressionStr
            .split(' ')
            .map((element) => {
                if(`${element}`.match(/^[\d]+!$/)) {
                    element = `${element}`.substring(0, element.length-1);
                    element = operate('!', element);
                    return element;
                } else return element;
            });
        expressionStr = inputArr.join('');
    } else {
        // Store ^, *, /, +, ~ operators and replace them once we handle the !.
        expressionStr = tempRemoveOperators(/[~\+\*\/\^]/g, expression);
    }
    // If another ! exists, recursively call handleFactorials
    if(`${expressionStr}`.includes('!')) {
        expressionStr = handleFactorials(`${expressionStr}`);
    }
    // Return once all exponents have been handled
    return `${expressionStr}`;
}

const handleExponents = (expression) => {
    let expressionStr = '';
    // Validate that only digits, decimals, ^, *, /, ~, +, and - are used in expression
    if(expression.match(/[^-~\d\+\/\*\^\.]/g)) { // Invalid
        console.log(`Error: Invalid input in handleExponents function: ${expression}`);
    } else if(!expression.match(/[^-\d\^\.]/g)) { // If only digits/decimals and ^ are present
        // Order of multiple consecutive powers is reversed so that if there are stacked exponents (power to a power), the top level exponent will be handled first: 2^3^4 will be handled as 2^(3^4).

        //TODO: INSTEAD OF REVERSING, TRY POP TO DO TOP LEVEL EXPONENTS FIRST
        expressionStr = `${expression}`.split('^').reverse().join('^').replace(/[\d]+\^[\d]+/, (x) => {
            return ` ${x} `
        });
        const inputArr = expressionStr
            .split(' ')
            .map((element) => {
                if(`${element}`.match(/^[\d]+\^[\d]+$/)) {
                    const expArr = `${element}`.split('^');
                    element = operate('^', expArr[1], expArr[0]);
                    return element;
                } else return element;
            });
        expressionStr = inputArr.join('').split('^').reverse().join('^');
    } else {
        // Store *, /, +, ~ operators and replace them once we handle the ^.
        expressionStr = tempRemoveOperators(/[~\+\*\/]/g, expression);
    }
    // If another power exists, recursively call handleExponents
    if(`${expressionStr}`.includes('^')) {
        expressionStr = handleExponents(`${expressionStr}`);
    }
    // Return once all exponents have been handled
    return `${expressionStr}`;
}

const handleMultiplicationDivision = (expression) => {
    let result = '';
    // Validate that only digits, decimals, *, /, ~, +, and - are used in expression
    if(expression.match(/[^-~\d\+\/\*\.]/g)) { //Invalid
        console.log(`Error: Invalid input in handleMultiplicationDivision function: ${expression}`);
    } else if(!expression.match(/[^-\d\/\*\.]/g)) { // If only digits/decimals and *, / are present
        // Multiplication and division are handled in order from left to right.
        let expressionStr = `${expression}`.replace(/[\*\/]/g, (x) => {
            return ` ${x} `;
        });
        const inputArr = expressionStr.split(' ');
        result = `${inputArr[0]}`;
        for(let i=1; i<inputArr.length; i++) {
            result = operate(`${inputArr[i]}`, result, `${inputArr[i+1]}`);
            if(`${result}`.includes("Error")) break;
            i++;
        }
    } else {
        // Store +, ~ operators and replace them once we handle the * and /.
        result = tempRemoveOperators(/[~\+]/g, expression);
    }
    return `${result}`;
}

const handleAdditionSubtraction = (expression) => {
    let result = '';
    // Validate that only digits, decimals, ~, +, and - are used in expression
    if(expression.match(/[^-~\d\+\.]/g)) { //Invalid
        console.log(`Error: Invalid input in handleAdditionSubtraction function: ${expression}`);
    } else {
        // Addition and subtraction are handled in order from left to right.
        let expressionStr = `${expression}`.replace(/[~\+]/g, (x) => {
            return ` ${x} `;
        });
        const inputArr = expressionStr.split(' ');
        result = `${inputArr[0]}`;
        for(let i=1; i<inputArr.length; i++) {
            result = operate(`${inputArr[i]}`, result, `${inputArr[i+1]}`);
            i++;
        }
    }
    return `${Number(result).toFixed(2)}`;
}

/* ************************************ //
// TEMPORARILY REMOVE OPERATORS FUNCTION//
// ************************************ */

const tempRemoveOperators = (untargetedOperRegex, expression) => {
    // Store untargeted operators so that we can replace them once we handle the target operator.
    const operatorArr = expression.match(untargetedOperRegex);
    // Temporarily remove untargeted operators operators
    let expressionStr = `${expression}`.replace(untargetedOperRegex, ' ');
    // Each element is now a digit/decimal or a series of target operators and digits to be evaluated
    const inputArr = expressionStr
        .split(' ')
        .map((element, index) => {
            if(operatorArr && index<operatorArr.length) {
                return `${calculate(element)}${operatorArr[index]}`;
            } else {
                return `${calculate(element)}`;
            }
    });
    expressionStr = inputArr.join('');
    return `${expressionStr}`;
}

const implicitToExplicitMultiplication = (expression) => {
    // Rewrite multiplication implied by parentheses with explicit * for parsing
    expression = expression.replace(/[\d]+\(/g, (x) => {
        return x.replace(/\(/, '*(');
    });
    expression = expression.replace(/\)[\d]+/g, (x) => {
        return x.replace(/\)/, ')*');
    });
    expression = expression.replace(/\)\(/g, (x) => {
        return x.replace(/\)/, ')*');
    });
    // Rewrite a factorial followed by a digit or ( as explicit multiplication
    expression = expression.replace(/![\d]+/g, (x) => {
        return x.replace(/!/, '!*');
    });
    expression = expression.replace(/!\(/g, (x) => {
        return x.replace(/!/, '!*');
    });
    return expression;
}

const prepNegatives = (expression) => {
    // Rewrite subtraction as ~ to distinguish from negatives.
    expression = expression
        .replace(/\+-/g, '+0~')
        .replace(/[\d\)]-[\d\(]/g, (x) => {
            return x.replace(/-/, '~');
        });
    return expression;
}

