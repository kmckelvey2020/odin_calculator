let inputArr = [];
let groupArr = [];
let result;

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

const calculate = () => {
    let expression = document.getElementById("show_input").innerHTML;
    validateExpression(expression);

}

const validateExpression = (expression) => {
    expression = expression.replace(/[\d]+\(/g, (x) => {
        return x.replace(/\(/, '*(');
    });
    expression = expression.replace(/\)[\d]+/g, (x) => {
        return x.replace(/\)/, ')*');
    });
    console.log(expression);
    console.log(validParenthesis(expression));
    console.log(validOperators(expression));
}

const validParenthesis = (expression) => {
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

const validOperators = (expression) => {
    const operators = ["+", "-", "*", "/", "^", "%", "!"];
    const arr = expression.split('');
    for(let i=1; i<arr.length; i++) {
        if(operators.includes(arr[i]) && operators.includes(arr[i-1])) {
            return [false, "Error: Invalid operation. Please enter a valid mathematical expression."];
        }
    }
    return [true, ''];
}

const enterNumber = (event) => {
    const inputContainer = document.getElementById("show_input");
    console.log(event.target);
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterOperator = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterOpenGroup = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterCloseGroup = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterDecimal = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
}

const enterEquals = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML += `${event.target.value}`;
    calculate();
}

const enterClear = (event) => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${event.target.value}`;
    inputArr = [];
    groupArr = [];
    result = undefined;
}

const enterDelete = () => {
    const inputContainer = document.getElementById("show_input");
    inputContainer.innerHTML = `${inputContainer.innerHTML.substring(0,inputContainer.innerHTML.length-1)}`;
}

const addListeners = () => {
    const numbers = document.querySelectorAll(".number");
    const operators = document.querySelectorAll(".operation");
    const openGroup = document.querySelector(".parenthesisL");
    const closeGroup = document.querySelector(".parenthesisR");
    const decimals = document.querySelector(".decimal");
    const equals = document.querySelector(".equals");
    const clear = document.querySelector(".clear");
    const deleteOne = document.querySelector(".delete");
    numbers.forEach((number) => {
        number.addEventListener('click', enterNumber);
    });
    operators.forEach((operation) => {
        operation.addEventListener('click', enterOperator);
    });
    openGroup.addEventListener('click', enterOpenGroup);
    closeGroup.addEventListener('click', enterCloseGroup);
    decimals.addEventListener('click', enterDecimal);
    equals.addEventListener('click', enterEquals);
    clear.addEventListener('click', enterClear);
    deleteOne.addEventListener('click', enterDelete);
}

addListeners();