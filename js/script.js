document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = document.querySelectorAll('.mode-selector button');
    const calculatorContainer = document.getElementById('calculator-container');
    const scientificCalculator = document.getElementById('scientific-calculator');
    const display = document.getElementById('display');
    const scientificDisplay = document.getElementById('scientific-display');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (button.id === 'standard-mode') {
                calculatorContainer.classList.remove('hidden');
                scientificCalculator.classList.add('hidden');
            } else if (button.id === 'scientific-mode') {
                calculatorContainer.classList.add('hidden');
                scientificCalculator.classList.remove('hidden');
            } 
        });
    });


// 处理标准计算器
    document.querySelectorAll('#calculator-container .btn, #calculator-container .opebtn, #calculator-container .clearbtn, #calculator-container .equalbtn').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            if (value === '=') {
                display.value = calculate(display.value);
            } else if (value === 'C') {
                display.value = '';
            } else if (value === 'del') {
                // 删除一个字符
                display.value = display.value.slice(0, -1);
            } else {
                display.value += value;
            }
        });
    });

//  // 处理标准计算器和科学计算器的按钮
//  document.querySelectorAll('#calculator-container .btn, #calculator-container .opebtn,#calculator-container .clearbtn, #calculator-container #delete, #calculator-container #equals, #scientific-calculator .btn, #scientific-calculator .opebtn, #scientific-calculator #sci-delete, #scientific-calculator #sci-equals,#scientific-calculator #sci-clear').forEach(button => {
//     button.addEventListener('click', () => {
//         const value = button.dataset.value;
        
//         if (button.id === 'sci-equals') {
//             const expression = scientificDisplay.value;
//             try {
//                 scientificDisplay.value = eval(expression);
//             } catch {
//                 scientificDisplay.value = 'Error';
//             }
//         } else if (button.id === 'sci-delete') {
//             // 删除一个字符
//             scientificDisplay.value = scientificDisplay.value.slice(0, -1);
//         } else if(button.id === 'sci-clear'){
//             scientificDisplay.value = '';    
//         }else if (value === '=') {
//             // 计算标准计算器表达式
//             display.value = calculate(display.value);
//         } else if (value === 'C') {
//             // 清除标准计算器输入框
//             display.value = '';
//         } else if (value === 'del') {
//             // 删除一个字符（标准计算器）
//             display.value = display.value.slice(0, -1);
//         } else {
//             // 添加按钮值到输入框
//             if (calculatorContainer.classList.contains('hidden')) {
//                 // 当前显示的是科学计算器
//                 scientificDisplay.value += value;
//             } else {
//                 // 当前显示的是标准计算器
//                 display.value += value;
//             }
//         }
//     });
// });

// // 计算表达式的函数
// function calculate(expression) {
//     try {
//         return eval(expression); // 计算表达式的值
//     } catch {
//         return 'Error'; // 捕捉到错误时返回 'Error'
//     }
// }

    // 阶乘函数
    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN; // 阶乘不能为负数或非整数
         if (n === 0) return 1;
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

function applyFunction(func, value) {
    const functions = {
        'sin': Math.sin,
        'cos': Math.cos,
        'tan': Math.tan,
        'log': Math.log10,
        'ln': Math.log,
        'sqrt': Math.sqrt,
        'cbrt': Math.cbrt,
        'exp': Math.exp,
        'abs': Math.abs,
        'n!': factorial 
    };
    if (functions[func]) {
        return functions[func](value);
    }
    return value;
}

function calculate(expression) {
    try {
        // 替换其他数学函数，如 sin(x) 替换为 applyFunction('sin', x)
        expression = expression.replace(/(\w+)\(([^)]+)\)/g, (match, p1, p2) => `applyFunction('${p1}', ${p2})`);
        // 替换阶乘运算符，将 n! 替换为 factorial(n)
        expression = expression.replace(/\(?(\d+)\)?!/g, (match, p1) => `factorial(${p1})`);        
        // 计算结果
        let result = new Function('factorial', 'applyFunction', `return ${expression}`)(factorial, applyFunction);
        return result;
    } catch {
        return 'Error';
    }
}// 表达式字符串
let expression = "factorial(5)";

// 动态创建并执行函数
let result = new Function('factorial', 'applyFunction', `return ${expression}`)(factorial, applyFunction);

console.log(result); // 输出: 120，因为 5 的阶乘是 120

console.log(factorial(5)); // 应输出 120
console.log(calculate('sin(0)')); // 应输出 0
console.log(calculate('sqrt(9)')); // 应输出 3
console.log(calculate('2 + 3 * (4 - 1)')); // 应输出 11


document.querySelectorAll('#scientific-calculator .btn, #scientific-calculator .opebtn, #scientific-calculator #sci-delete, #scientific-calculator #sci-equals, #scientific-calculator #sci-clear').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;

        if (button.id === 'sci-equals') {
            scientificDisplay.value = calculate(scientificDisplay.value);
        } else if (button.id === 'sci-delete') {
            scientificDisplay.value = scientificDisplay.value.slice(0, -1);
        } else if (button.id === 'sci-clear') {
            scientificDisplay.value = '';    
        } else if (value === 'del') {
            scientificDisplay.value = scientificDisplay.value.slice(0, -1);
        } else {
            scientificDisplay.value += value;
        }
    });
});

 // 键盘事件处理
 document.addEventListener('keydown', (event) => {
    const key = event.key;
    const activeDisplay = calculatorContainer.classList.contains('hidden') ? scientificDisplay : display;

    if (!isNaN(key)) {
        // 数字键
        activeDisplay.value += key;
    } else if (['+', '-', '*', '/'].includes(key)) {
        // 运算符
        activeDisplay.value += key;
    } else if (key === '.') {
        // 小数点，只允许每个数字有一个小数点
        if (!activeDisplay.value.endsWith('.') && !/\d+\.\d*$/.test(activeDisplay.value)) {
            activeDisplay.value += key;
        }
    } else if (key === 'Enter'||key==='=') {
        // 回车键，相当于 "="
        event.preventDefault(); // 阻止默认回车行为
        activeDisplay.value = calculate(activeDisplay.value);
    }else if (key === '(' || key === ')') {
            // 左右括号
            activeDisplay.value += key;
    } else if (key === 'Backspace') {
        // 删除键
        activeDisplay.value = activeDisplay.value.slice(0, -1);
    } else if (key === 'Escape') {
        // 清空 (Esc 键)
        activeDisplay.value = '';
    }
});



});
