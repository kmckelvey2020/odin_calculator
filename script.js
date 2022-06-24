
/* ************************************ //
//         CALCULATE FUNCTION           //
// ************************************ */

const calculate = (expression) => {
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

/* ************************************ //
//  INITIAL INPUT VALIDATION FUNCTIONS  //
// ************************************ */

const isValidExpression = (expression) => {
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


/* ************************************ //
//        INPUT ENTRY FUNCTIONS         //
// ************************************ */ 
const enterInput = (event) => {
    const inputContainer = document.getElementById("show_input");
    if(event.key) {
        inputContainer.innerHTML += `${event.key}`;
    } else {
        inputContainer.innerHTML += `${event.target.value}`;
    }
}

const enterEquals = () => {
    const inputOutputContainer = document.getElementById("input_output_screen");
    const inputContainer = document.getElementById("show_input");
    let result = "";
    if(!inputContainer.innerHTML) {
        result = "Error: No expression entered.";
    } else {
        let expression = inputContainer.innerHTML;
        //expression = implicitToExplicitMultiplication(expression);
        let validation = [...isValidExpression(expression)];
        if(validation[0]) {
            result = calculate(expression);
        } else result = validation[1];
    }

    inputContainer.id = "old_input_container";
    inputContainer.className = "old_input_container";

    if(`${result}`.includes("Error")) inputOutputContainer.innerHTML = '';
    
    const outputContainer = document.createElement('div');
    outputContainer.id = "show_output";
    outputContainer.className = "show_output";
    outputContainer.style.textAlign = "right";
    outputContainer.innerHTML = `${result}`;

    const newInputContainer = document.createElement('div');
    newInputContainer.id = "show_input";
    newInputContainer.className = "show_input";
    newInputContainer.style.textAlign = "right";
    newInputContainer.innerHTML = '';

    inputOutputContainer.appendChild(outputContainer);
    inputOutputContainer.appendChild(newInputContainer);
}

const enterClear = () => {
    const inputOutputContainer = document.getElementById("input_output_screen");
    inputOutputContainer.innerHTML = '';

    const newInputContainer = document.createElement('div');
    newInputContainer.id = "show_input";
    newInputContainer.className = "show_input";
    newInputContainer.style.textAlign = "right";
    newInputContainer.innerHTML = '';

    inputOutputContainer.appendChild(newInputContainer);
}

const enterDelete = () => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${inputContainer.innerHTML.substring(0,inputContainer.innerHTML.length-1)}`;
}

/* ************************************ //
//        EVENT LISTENER FUNCTION       //
// ************************************ */

const addListeners = () => {
    const inputs = document.querySelectorAll(".input");
    const equals = document.querySelector(".equals");
    const clear = document.querySelector(".clear");
    const deleteOne = document.querySelector(".delete");
    
    inputs.forEach((input) => {
        input.addEventListener('click', enterInput);
    });
    equals.addEventListener('click', enterEquals);
    clear.addEventListener('click', enterClear);
    deleteOne.addEventListener('click', enterDelete);
    window.addEventListener('keydown', function(event) {
        const btn = document.querySelector(`button[value="${event.key}"]`);
        if((btn && event.key==="=") || event.key==="Enter") {
            enterEquals();
        } else if(event.key==="Backspace" || event.key==="Delete") {
            enterDelete();
        } else if(event.key==="Escape") {
            enterClear();
        } else if(btn) {
            enterInput(event);
        } else return;
    });
}

addListeners();