let budget = 0;
let totalExpenses = 0;
let alertTriggered = false;

const budgetInput = document.getElementById('budget');
const setBudgetBtn = document.getElementById('set-budget-btn');
const expenseDescriptionInput = document.getElementById('expense-description');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const displayBudget = document.getElementById('display-budget');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');
const alertBox = document.getElementById('alert-box');
const clearDataBtn = document.getElementById('clear-data-btn');
const endMonthBtn = document.getElementById('end-month-btn');
const previousMonthsList = document.getElementById('previous-months-list');
const totalSavingsAmount = document.getElementById('total-savings-amount');

// Load saved data from localStorage on page load
window.onload = function () {
    loadBudgetData();
    loadExpensesData();
    loadPreviousMonthsData();
    updateBalance();
    updateTotalSavings();
};

setBudgetBtn.addEventListener('click', () => {
    budget = parseFloat(budgetInput.value);
    saveBudgetData();
    displayBudget.textContent = budget.toFixed(2);
    updateBalance();
});

addExpenseBtn.addEventListener('click', () => {
    const expenseAmount = parseFloat(expenseAmountInput.value);
    if (!isNaN(expenseAmount) && expenseAmount > 0) {
        totalExpenses += expenseAmount;
        saveExpensesData();
        displayExpenses.textContent = totalExpenses.toFixed(2);
        updateBalance();
    }

    // Clear inputs
    expenseDescriptionInput.value = '';
    expenseAmountInput.value = '';
});

endMonthBtn.addEventListener('click', () => {
    saveMonthData();
    clearCurrentMonthData();
    loadPreviousMonthsData();
    updateTotalSavings();
});

clearDataBtn.addEventListener('click', () => {
    clearAllData();
});

function updateBalance() {
    const remainingBalance = budget - totalExpenses;
    displayBalance.textContent = remainingBalance.toFixed(2);

    if (remainingBalance < 0 && !alertTriggered) {
        showAlert();
    } else if (remainingBalance >= 0) {
        hideAlert();
    }
}

function showAlert() {
    alertTriggered = true;
    gsap.to(alertBox, { display: 'block', opacity: 1, duration: 0.5 });
}

function hideAlert() {
    alertTriggered = false;
    gsap.to(alertBox, { display: 'none', opacity: 0, duration: 0.5 });
}

// Save budget data to localStorage
function saveBudgetData() {
    localStorage.setItem('budget', budget);
}

// Save expenses data to localStorage
function saveExpensesData() {
    localStorage.setItem('totalExpenses', totalExpenses);
}

// Load budget data from localStorage
function loadBudgetData() {
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
        budget = parseFloat(savedBudget);
        displayBudget.textContent = budget.toFixed(2);
    }
}

// Load expenses data from localStorage
function loadExpensesData() {
    const savedExpenses = localStorage.getItem('totalExpenses');
    if (savedExpenses) {
        totalExpenses = parseFloat(savedExpenses);
        displayExpenses.textContent = totalExpenses.toFixed(2);
    }
}

// Save the current month's data and reset
function saveMonthData() {
    const remainingBalance = budget - totalExpenses;
    const monthKey = `month_${new Date().toISOString().slice(0, 7)}`;
    const monthData = {
        budget: budget,
        expenses: totalExpenses,
        savings: remainingBalance
    };
    localStorage.setItem(monthKey, JSON.stringify(monthData));
}

// Load previous months' data
function loadPreviousMonthsData() {
    previousMonthsList.innerHTML = '';
    const keys = Object.keys(localStorage).filter(key => key.startsWith('month_'));
    keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key));
        const listItem = document.createElement('li');
        listItem.textContent = `${key.replace('month_', '')}: Budget: $${data.budget}, Expenses: $${data.expenses}, Savings: $${data.savings}`;
        previousMonthsList.appendChild(listItem);
    });
}

// Update total savings across all months
function updateTotalSavings() {
    let totalSavings = 0;
    const keys = Object.keys(localStorage).filter(key => key.startsWith('month_'));
    keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key));
        totalSavings += data.savings;
    });
    totalSavingsAmount.textContent = `$${totalSavings.toFixed(2)}`;
}

// Clear current month data and reset
function clearCurrentMonthData() {
    budget = 0;
    totalExpenses = 0;
    saveBudgetData();
    saveExpensesData();
    displayBudget.textContent = budget.toFixed(2);
    displayExpenses.textContent = totalExpenses.toFixed(2);
    updateBalance();
}

// Clear all data from localStorage
function clearAllData() {
    localStorage.clear();
    clearCurrentMonthData();
    loadPreviousMonthsData();
    updateTotalSavings();
}

// Three.js Water Droplet Animation
function initThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background-animation').appendChild(renderer.domElement);

    camera.position.z = 5;

    const droplets = [];
    const dropletCount = 50;

    for (let i = 0; i < dropletCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x8ec5fc });
        const droplet = new THREE.Mesh(geometry, material);

        droplet.position.x = (Math.random() - 0.5) * 10;
        droplet.position.y = Math.random() * 10;
        droplet.position.z = (Math.random() - 0.5) * 10;

        scene.add(droplet);
        droplets.push(droplet);
    }

    function animate() {
        requestAnimationFrame(animate);

        droplets.forEach(droplet => {
            droplet.position.y -= 0.02;

            if (droplet.position.y < -5) {
                droplet.position.y = 5;
                droplet.position.x = (Math.random() - 0.5) * 10;
                droplet.position.z = (Math.random() - 0.5) * 10;
            }
        });

        renderer.render(scene, camera);
    }

    animate();
}

initThreeJS();
