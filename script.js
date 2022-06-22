let inputArr = [];
let groupArr = [];

/* ******************************** //
//     OPERATION FUNCTIONS          //
// ******************************** */

const add = (a, b) => {
    return a + b;
}

const subtract = (a, b) => {
    return a - b;
}

const multiply = (a, b) => {
    return a * b;
}

const divide = (a, b) => {
    return (a/b).toFixed(2);
}

const power = (a, b) => {
    return Math.pow(a, b);
}

const modulus = (a, b) => {
    return a % b;
}

// If a<0, factorial is undefined
const factorial = (a) => {
    let factorialResult = 1;
    for(let i=1; i<=a; i++) {
        factorialResult *= i;
    }
    if(a>=0) {
        return factorialResult;
    } else {
        return undefined;
    }
}

const operate = (operator, a, b) => {
    let operationResult;
    switch (operator) {
        case "+":
            operationResult = add(a, b);
            break;
        case "-":
            operationResult = subtract(a, b);
            break;
        case "*":
            operationResult = multiply(a, b);
            break;
        case "/":
            operationResult = divide(a, b);
            break;
        case "%":
            operationResult = modulus(a, b);
            break;
        case "^":
            operationResult = power(a, b);
            break;
        case "!":
            operationResult = factorial(a);
            break;
        case "(":
            break;
        case ")":
            break;
        default:
            break;
    }
    return operationResult;
}

const calculate = (expression) => {
    let result = '';
    return result;
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
    inputContainer.innerHTML += `\n${result}`;
}

const enterClear = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${event.target.value}`;
    inputArr = [];
    groupArr = [];
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