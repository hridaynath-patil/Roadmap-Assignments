document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const resultDisplay = document.getElementById('result');
    const errorMsg = document.getElementById('error-msg');
    const clearBtn = document.getElementById('clearBtn');
    
    // Getting all operation buttons
    const opBtns = document.querySelectorAll('.op-btn');
    
    function calculate(action) {
        // Reset state
        errorMsg.classList.add('hidden');
        
        const val1 = num1Input.value.trim();
        const val2 = num2Input.value.trim();
        
        // Validate inputs
        if (val1 === '' || val2 === '' || isNaN(val1) || isNaN(val2)) {
            errorMsg.classList.remove('hidden');
            return;
        }
        
        const num1 = parseFloat(val1);
        const num2 = parseFloat(val2);
        let resultValue = 0;
        let prefix = '= ';
        
        // Execute operation specified by the button
        switch (action) {
            case 'add':
                resultValue = num1 + num2;
                break;
            case 'subtract':
                resultValue = num1 - num2;
                break;
            case 'multiply':
                resultValue = num1 * num2;
                break;
            default:
                return;
        }
        
        // Formatting to avoid extremely long decimals
        // Using Number() drops unnecessary trailing zeros unlike toFixed() alone
        resultValue = Number(resultValue.toFixed(8));
        
        // Update display
        resultDisplay.textContent = prefix + resultValue;
    }
    
    // Add click listeners to operation buttons
    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            calculate(action);
        });
    });
    
    // Clear functionalilty
    clearBtn.addEventListener('click', () => {
        num1Input.value = '';
        num2Input.value = '';
        resultDisplay.textContent = '= 0';
        errorMsg.classList.add('hidden');
        num1Input.focus();
    });
});
