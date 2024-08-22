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

// Load saved data from localStorage on page load
window.onload = function () {
    loadBudgetData();
    loadExpensesData();
    updateBalance();
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

// Clear all data from localStorage
function clearAllData() {
    localStorage.removeItem('budget');
    localStorage.removeItem('totalExpenses');
    budget = 0;
    totalExpenses = 0;
    displayBudget.textContent = '0';
    displayExpenses.textContent = '0';
    displayBalance.textContent = '0';
    hideAlert();
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
