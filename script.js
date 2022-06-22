/* ******************************** //
//     OPERATION FUNCTIONS          //
// ******************************** */

const modulus = (a, b) => {
    return a % b;
}

const operate = (operator, value1, value2) => {
    const a = Number(value1), b = Number(value2);
    switch (operator) {
        case "+":
            return a + b;
            break;
        case "-":
            return a - b;
            break;
        case "*":
            return a * b;
            break;
        case "/":
            return (a/b).toFixed(2);
            break;
        case "%":
            return a % b;
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
    console.log(expressionStr);
    const inputArr = expressionStr
        .split(' ')
        .map((element) => {
            // If a complete expression contained within () exists, strip the (), evaluate the expression and replace the () expression with its result in inputArr
            if(element.match(/^\(.*\)$/)) {
                element = `${element}`.substring(1, element.length-1);
                console.log(element);
                return calculate(element);
            } else return element;
        });
    expressionStr = inputArr.join('');
    console.log(expressionStr);
    // If a set of outer () exists after inner () are evaluated, handle those ()
    if(expressionStr.includes('(')) {
        expressionStr = handleParenthesis(expressionStr);
    }
    // Return once all inner and outer () have been handled
    return `${expressionStr}`;
}

const handleExponents = (expression) => {
    // Order of powers is reversed so that if there are stacked exponents (power to a power), the top level exponent will be handled first: 2^3^4 will be handled as 2^(3^4).
    let expressionStr = `${expression}`.split('^').reverse().join('^').replace(/[\d]+\^[\d]+/, (x) => {
        return ` ${x} `
    });
    console.log(expressionStr);
    const inputArr = expressionStr
        .split(' ')
        .map((element) => {
            // If a number ([\d]+) is raised to the power of another number using ^, the power is evaluated and returned to the inputArr
            if(`${element}`.match(/^[\d]+\^[\d]+$/)) {
                const expArr = `${element}`.split('^');
                element = operate('^', expArr[1], expArr[0]);
                console.log(element);
                return element;
            } else return element;
        });
    expressionStr = inputArr.join('').split('^').reverse().join('^');
    console.log(expressionStr);
    // If another power exists, recursively call handleExponents
    if(expressionStr.includes('^')) {
        expressionStr = handleExponents(expressionStr);
    }
    // Return once all exponents have been handled
    return `${expressionStr}`;
}

const handleMultiplicationDivision = (expression) => {
    let result = '';
    // Validate that only digits, *, /, +, and - are used in expression
    if(expression.match(/[^-\d\+\/\*]/g)) {
        // Invalid
        console.log(`Error: Invalid input in handleMultiplicationDivision function: ${expression}`);
    } else if(!expression.match(/[^\d\/\*]/g)) {
        // Multiplication and division are handled in order from left to right.
        let expressionStr = `${expression}`.replace(/\*/g, " * ").replace(/\//g, " / ");
        console.log(expressionStr);
        const inputArr = expressionStr.split(' ');
        console.log(inputArr);
        result = `${inputArr[0]}`;
        console.log(result);
        for(let i=1; i<inputArr.length; i++) {
            result = operate(`${inputArr[i]}`, result, `${inputArr[i+1]}`);
            i++;
            console.log(result);
        }
    } else {
        // Store addition and subtraction operators so that we can replace them once we handle the mult and div
        const addSubtOperatorArr = expression.match(/[-\+]/g);
        console.log(addSubtOperatorArr);
        // Temporarily remove +, - operators
        let expressionStr = `${expression}`
            .replace(/\+/g, ' ')
            .replace(/-/g, ' ');
        console.log(expressionStr);
        // Each element is a digit or a series of *,/, and digits to be evaluated
        const inputArr = expressionStr
            .split(' ')
            .map((element, index) => {
                if(index<addSubtOperatorArr.length) {
                    return `${calculate(element)}${addSubtOperatorArr[index]}`;
                } else {
                    return `${calculate(element)}`;
                }
        });
        result = inputArr.join('');
        console.log(result);
    }
    return `${result}`;
}

const handleAdditionSubtraction = (expression) => {
    let result = '';
    // Validate that only digits, +, and - are used in expression
    if(expression.match(/[^-\d\+\.]/g)) {
        // Invalid
        console.log(`Error: Invalid input in handleAdditionSubtraction function: ${expression}`);
    } else {
        // Addition and subtraction are handled in order from left to right.
        let expressionStr = `${expression}`.replace(/\+/g, " + ").replace(/-/g, " - ");
        console.log(expressionStr);
        const inputArr = expressionStr.split(' ');
        console.log(inputArr);
        result = `${inputArr[0]}`;
        console.log(result);
        for(let i=1; i<inputArr.length; i++) {
            result = operate(`${inputArr[i]}`, result, `${inputArr[i+1]}`);
            i++;
            console.log(result);
        }
    }
    return `${result}`;
}

const calculate = (expression) => {
    let expressionStr = `${expression}`;

    // handle Parentheses first
    if(expressionStr.includes('(')) {
        expressionStr = handleParenthesis(expressionStr);
    }

    // handle Exponents second
    if(expressionStr.includes('^')) {
        expressionStr = handleExponents(expressionStr);
    }

    // handle Multiplication and Division (in order from left to right)
    if(expressionStr.includes('*') || expressionStr.includes('/')) {
        expressionStr = handleMultiplicationDivision(expressionStr);
    }

    // handle Addition and Subtraction (in order from left to right)
    if(expressionStr.includes('+') || expressionStr.includes('-')) {
        expressionStr = handleAdditionSubtraction(expressionStr);
    }
    
    return expressionStr;
}

const isValidExpression = (expression) => {
    console.log(expression);
    console.log(isValidInput(expression));
    console.log(isValidParenthesis(expression));
    console.log(isValidOperators(expression));
    return isValidInput(expression)[0] && isValidParenthesis(expression)[0] && isValidOperators(expression)[0];
}

const isValidInput = (expression) => {
    const invalidInputs = /[^-%!\+\*\/\^\(\)\d]/g;
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
    // Todo: Check to make sure expression doesn't end with an operator that requires two operands. Check to make sure expression doesn't begin with an operator (if it begins with -, treat as negative). Ignore leading + sign.
    const operators = ["+", "-", "*", "/", "^", "%"];
    const arr = expression.split('');
    for(let i=1; i<arr.length; i++) {
        // Cannot have two consecutive operators: "+/"
        if((operators.includes(arr[i-1]) && operators.includes(arr[i]))
            // Cannot have open parenthesis followed by an operator: "(+"
            || (arr[i-1]==='(' && (operators.includes(arr[i]) || arr[i]==="!"))
            // Cannot have an operator followed by a close parenthesis: "+)"
            || ((operators.includes(arr[i-1]) || arr[i]==="!") && arr[i]===')')
            // Cannot have an operator followed by !: "+!"
            || (operators.includes(arr[i-1]) && arr[i]==='!')) {
            return [false, "Error: Invalid operation. Please enter a valid mathematical expression."];
        }
    }
    return [true, ''];
}

const enterInput = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterEquals = () => {
    const inputContainer = document.getElementById("show_input");
    let result = "";
    if(!inputContainer.innerHTML) {
        result = "Error: No expression entered.";
    } else {
        let expression = inputContainer.innerHTML;
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
        if(isValidExpression(expression)) {
            result = calculate(expression);
        }
    }
    inputContainer.innerHTML += `\r${result}`;
}

const enterClear = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${event.target.value}`;
}

const enterDelete = () => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${inputContainer.innerHTML.substring(0,inputContainer.innerHTML.length-1)}`;
}

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
}

addListeners();