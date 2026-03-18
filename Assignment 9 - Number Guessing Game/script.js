document.addEventListener('DOMContentLoaded', () => {
    let randomNumber, attempts;
    
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const message = document.getElementById('message');
    const attemptCount = document.getElementById('attemptCount');
    const restartBtn = document.getElementById('restartBtn');
    
    function initGame() {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        attemptCount.textContent = '0';
        message.textContent = '';
        message.className = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
        restartBtn.classList.add('hidden');
        guessInput.focus();
    }
    
    function handleGuess() {
        const userGuess = parseInt(guessInput.value);
        
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            showMessage('Please enter a valid number between 1 and 100.', 'error');
            return;
        }
        
        attempts++;
        attemptCount.textContent = attempts;
        
        if (userGuess === randomNumber) {
            showMessage(`Congratulations! ${randomNumber} is correct!`, 'correct');
            endGame();
        } else if (userGuess > randomNumber) {
            showMessage('Too high! Try again.', 'too-high');
        } else {
            showMessage('Too low! Try again.', 'too-low');
        }
        
        guessInput.value = '';
        if (userGuess !== randomNumber) guessInput.focus();
    }
    
    function showMessage(msg, className) {
        message.textContent = msg;
        message.className = className;
    }
    
    function endGame() {
        guessInput.disabled = true;
        guessBtn.disabled = true;
        restartBtn.classList.remove('hidden');
    }
    
    guessBtn.addEventListener('click', handleGuess);
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });
    
    restartBtn.addEventListener('click', initGame);
    

    initGame();
});
