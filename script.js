// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Calculator tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculators = document.querySelectorAll('.calculator');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            calculators.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-calculator`).classList.add('active');
        });
    });
});

// Investment Calculator
let investmentChart = null;

function calculateInvestment() {
    const type = document.getElementById('investment-type').value;
    const amount = parseFloat(document.getElementById('investment-amount').value);
    const years = parseInt(document.getElementById('investment-years').value);
    const rate = parseFloat(document.getElementById('investment-rate').value);

    let data = [];
    let totalAmount = 0;

    if (type === 'sip') {
        for (let i = 1; i <= years; i++) {
            totalAmount = (totalAmount + amount * 12) * (1 + rate / 100);
            data.push({
                year: i,
                amount: Math.round(totalAmount)
            });
        }
    } else {
        for (let i = 1; i <= years; i++) {
            totalAmount = amount * Math.pow(1 + rate / 100, i);
            data.push({
                year: i,
                amount: Math.round(totalAmount)
            });
        }
    }

    updateChart(data);
    updateSummary(data[data.length - 1].amount, type === 'sip' ? amount * 12 * years : amount);
}

function updateChart(data) {
    const ctx = document.getElementById('investment-chart').getContext('2d');
    
    if (investmentChart) {
        investmentChart.destroy();
    }

    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `Year ${d.year}`),
            datasets: [{
                label: 'Investment Value',
                data: data.map(d => d.amount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateSummary(finalAmount, totalInvestment) {
    const returns = finalAmount - totalInvestment;
    const summary = document.querySelector('.result-summary');
    
    summary.innerHTML = `
        <div class="summary-grid">
            <div class="summary-item">
                <h4>Total Investment</h4>
                <p>₹${totalInvestment.toLocaleString()}</p>
            </div>
            <div class="summary-item">
                <h4>Expected Returns</h4>
                <p>₹${returns.toLocaleString()}</p>
            </div>
            <div class="summary-item">
                <h4>Final Amount</h4>
                <p>₹${finalAmount.toLocaleString()}</p>
            </div>
        </div>
    `;
}

// Add styles for summary grid
const style = document.createElement('style');
style.textContent = `
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }
    .summary-item {
        text-align: center;
        padding: 1rem;
        background: var(--accent);
        border-radius: var(--radius);
    }
    .summary-item h4 {
        color: var(--text-muted);
        margin-bottom: 0.5rem;
    }
    .summary-item p {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary);
    }
`;
document.head.appendChild(style);

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links'); // Renamed this variable

    mobileMenuBtn?.addEventListener('click', function() {
        navLinksContainer.classList.toggle('show');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navLinksContainer.classList.remove('show');
            mobileMenuBtn?.classList.remove('active');
        }
    });

    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a'); // No conflict now
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const taxCalculatorForm = document.getElementById('tax-calculator-form');
    const taxResult = document.getElementById('tax-result');

    if (taxCalculatorForm) {
        taxCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const income = parseFloat(document.getElementById('income').value);
            const age = document.getElementById('age').value;
            const regime = document.getElementById('regime').value;

            const taxDetails = calculateTax(income, age, regime);
            displayTaxResults(taxDetails);
        });
    }
});

function calculateTax(income, age, regime) {
    let tax = 0;
    let cess = 0;
    let totalTax = 0;
    
    if (regime === 'old') {
        // Old Regime Tax Calculation
        if (income <= 250000) {
            tax = 0;
        } else if (income <= 500000) {
            tax = (income - 250000) * 0.05;
        } else if (income <= 1000000) {
            tax = 12500 + (income - 500000) * 0.2;
        } else {
            tax = 112500 + (income - 1000000) * 0.3;
        }
    } else {
        // New Regime Tax Calculation
        if (income <= 300000) {
            tax = 0;
        } else if (income <= 600000) {
            tax = (income - 300000) * 0.05;
        } else if (income <= 900000) {
            tax = 15000 + (income - 600000) * 0.1;
        } else if (income <= 1200000) {
            tax = 45000 + (income - 900000) * 0.15;
        } else if (income <= 1500000) {
            tax = 90000 + (income - 1200000) * 0.2;
        } else {
            tax = 150000 + (income - 1500000) * 0.3;
        }
    }

    // Calculate cess
    cess = tax * 0.04;
    totalTax = tax + cess;

    return {
        income,
        tax,
        cess,
        totalTax
    };
}

function displayTaxResults(taxDetails) {
    const resultDiv = document.querySelector('.result-grid');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <h4>Total Income</h4>
                <p>₹${taxDetails.income.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Income Tax</h4>
                <p>₹${taxDetails.tax.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Health & Education Cess</h4>
                <p>₹${taxDetails.cess.toLocaleString()}</p>
            </div>
            <div class="result-item">
                <h4>Total Tax Liability</h4>
                <p>₹${taxDetails.totalTax.toLocaleString()}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-inquiry-form');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            // Validate form
            if (validateForm(formDataObj)) {
                // Show success message
                showNotification('Thank you for your inquiry. We will contact you shortly!', 'success');
                registrationForm.reset();
            }
        });
    }
});

function validateForm(data) {
    // Basic validation
    if (!data.name || data.name.trim() === '') {
        showNotification('Please enter your name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }

    if (!data.service || data.service === '') {
        showNotification('Please select a service', 'error');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem';
    notification.style.borderRadius = 'var(--radius)';
    notification.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Service price calculator
const servicePrices = {
    company: {
        private: 9999,
        public: 14999,
        opc: 7999,
        llp: 8999
    },
    gst: {
        new: 799,
        returns: 599,
        cancellation: 999,
        modification: 699
    },
    trademark: {
        brand: 1999,
        logo: 2499,
        search: 499,
        renewal: 1499
    },
    msme: {
        udyam: 499,
        ssi: 699,
        benefits: 999,
        schemes: 799
    }
};

// Add price calculator functionality if needed
function calculateServicePrice(service, type) {
    return servicePrices[service]?.[type] || 0;
}
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            calculatorContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-calculator`).classList.add('active');
        });
    });

    // Initialize first calculator
    calculateLoanEMI();
});

// Loan EMI Calculator
let loanChart = null;

function calculateLoanEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-interest').value) / 1200; // Monthly interest rate
    const time = parseFloat(document.getElementById('loan-tenure').value) * 12; // Total months

    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    const totalPayment = emi * time;
    const totalInterest = totalPayment - principal;

    // Update result summary
    document.getElementById('monthly-emi').textContent = `₹${Math.round(emi).toLocaleString()}`;
    document.getElementById('total-interest').textContent = `₹${Math.round(totalInterest).toLocaleString()}`;
    document.getElementById('total-payment').textContent = `₹${Math.round(totalPayment).toLocaleString()}`;

    // Update chart
    updateLoanChart(principal, totalInterest);
}

function updateLoanChart(principal, interest) {
    const ctx = document.getElementById('loan-chart').getContext('2d');
    
    if (loanChart) {
        loanChart.destroy();
    }

    loanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Fixed Deposit Calculator
let fdChart = null;

function calculateFD() {
    const principal = parseFloat(document.getElementById('fd-amount').value);
    const rate = parseFloat(document.getElementById('fd-interest').value) / 100;
    const time = parseFloat(document.getElementById('fd-tenure').value);

    const maturityAmount = principal * Math.pow(1 + rate, time);
    const interestEarned = maturityAmount - principal;

    // Update result summary
    document.getElementById('fd-maturity').textContent = `₹${Math.round(maturityAmount).toLocaleString()}`;
    document.getElementById('fd-interest-earned').textContent = `₹${Math.round(interestEarned).toLocaleString()}`;

    // Update chart
    updateFDChart(principal, interestEarned);
}

function updateFDChart(principal, interest) {
    const ctx = document.getElementById('fd-chart').getContext('2d');
    
    if (fdChart) {
        fdChart.destroy();
    }

    fdChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest Earned'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Recurring Deposit Calculator
let rdChart = null;

function calculateRD() {
    const monthlyInvestment = parseFloat(document.getElementById('rd-amount').value);
    const rate = parseFloat(document.getElementById('rd-interest').value) / 100;
    const years = parseFloat(document.getElementById('rd-tenure').value);
    
    const months = years * 12;
    const monthlyRate = rate / 12;
    
    const maturityAmount = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    const interestEarned = maturityAmount - totalInvestment;

    // Update result summary
    document.getElementById('rd-maturity').textContent = `₹${Math.round(maturityAmount).toLocaleString()}`;
    document.getElementById('rd-investment').textContent = `₹${Math.round(totalInvestment).toLocaleString()}`;
    document.getElementById('rd-interest-earned').textContent = `₹${Math.round(interestEarned).toLocaleString()}`;

    // Update chart
    updateRDChart(totalInvestment, interestEarned);
}

function updateRDChart(investment, interest) {
    const ctx = document.getElementById('rd-chart').getContext('2d');
    
    if (rdChart) {
        rdChart.destroy();
    }

    rdChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Interest Earned'],
            datasets: [{
                data: [investment, interest],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Financial Goal Calculator
let goalChart = null;

function calculateGoal() {
    const targetAmount = parseFloat(document.getElementById('goal-amount').value);
    const years = parseFloat(document.getElementById('goal-years').value);
    const returns = parseFloat(document.getElementById('goal-returns').value) / 100;

    const monthlyRate = returns / 12;
    const months = years * 12;

    const monthlyInvestment = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalInvestment = monthlyInvestment * months;
    const wealthGained = targetAmount - totalInvestment;

    // Update result summary
    document.getElementById('monthly-investment').textContent = `₹${Math.round(monthlyInvestment).toLocaleString()}`;
    document.getElementById('total-investment').textContent = `₹${Math.round(totalInvestment).toLocaleString()}`;
    document.getElementById('wealth-gained').textContent = `₹${Math.round(wealthGained).toLocaleString()}`;

    // Update chart
    updateGoalChart(totalInvestment, wealthGained);
}

function updateGoalChart(investment, wealth) {
    const ctx = document.getElementById('goal-chart').getContext('2d');
    
    if (goalChart) {
        goalChart.destroy();
    }

    goalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Wealth Gained'],
            datasets: [{
                data: [investment, wealth],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            calculatorContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-calculator`).classList.add('active');
        });
    });

    // Initialize first calculator
    calculateSIP();
});

// SIP Calculator
let sipChart = null;

function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-amount').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    const returns = parseFloat(document.getElementById('sip-returns').value);

    const monthlyRate = returns / 12 / 100;
    const months = years * 12;
    
    const invested = monthlyInvestment * months;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = futureValue - invested;

    // Update result summary
    document.getElementById('sip-invested').textContent = `₹${Math.round(invested).toLocaleString()}`;
    document.getElementById('sip-returns-value').textContent = `₹${Math.round(estimatedReturns).toLocaleString()}`;
    document.getElementById('sip-total').textContent = `₹${Math.round(futureValue).toLocaleString()}`;

    // Update chart
    updateSIPChart(invested, estimatedReturns);
}

function updateSIPChart(invested, returns) {
    const ctx = document.getElementById('sip-chart').getContext('2d');
    
    if (sipChart) {
        sipChart.destroy();
    }

    sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Expected Returns'],
            datasets: [{
                data: [invested, returns],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Lump Sum Calculator
let lumpsumChart = null;

function calculateLumpsum() {
    const principal = parseFloat(document.getElementById('lumpsum-amount').value);
    const years = parseFloat(document.getElementById('lumpsum-years').value);
    const returns = parseFloat(document.getElementById('lumpsum-returns').value);

    const futureValue = principal * Math.pow(1 + returns / 100, years);
    const estimatedReturns = futureValue - principal;

    // Update result summary
    document.getElementById('lumpsum-invested').textContent = `₹${Math.round(principal).toLocaleString()}`;
    document.getElementById('lumpsum-returns-value').textContent = `₹${Math.round(estimatedReturns).toLocaleString()}`;
    document.getElementById('lumpsum-total').textContent = `₹${Math.round(futureValue).toLocaleString()}`;

    // Update chart
    updateLumpsumChart(principal, estimatedReturns);
}

function updateLumpsumChart(invested, returns) {
    const ctx = document.getElementById('lumpsum-chart').getContext('2d');
    
    if (lumpsumChart) {
        lumpsumChart.destroy();
    }

    lumpsumChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Expected Returns'],
            datasets: [{
                data: [invested, returns],
                backgroundColor: ['#2563eb', '#93c5fd']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Portfolio Analysis
let portfolioChart = null;
let portfolioItems = [];

function addPortfolioItem() {
    const type = document.getElementById('investment-type').value;
    const value = parseFloat(document.getElementById('investment-value').value);

    if (!value || isNaN(value)) {
        alert('Please enter a valid investment value');
        return;
    }

    portfolioItems.push({ type, value });
    updatePortfolioList();
    updatePortfolioChart();
}

function removePortfolioItem(index) {
    portfolioItems.splice(index, 1);
    updatePortfolioList();
    updatePortfolioChart();
}

function updatePortfolioList() {
    const container = document.getElementById('portfolio-items');
    const totalValue = portfolioItems.reduce((sum, item) => sum + item.value, 0);
    
    container.innerHTML = portfolioItems.map((item, index) => `
        <div class="portfolio-item">
            <span>${item.type}: ₹${item.value.toLocaleString()} (${Math.round(item.value/totalValue*100)}%)</span>
            <button onclick="removePortfolioItem(${index})">×</button>
        </div>
    `).join('');

    document.getElementById('portfolio-total').textContent = `₹${Math.round(totalValue).toLocaleString()}`;
}

function updatePortfolioChart() {
    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    
    if (portfolioChart) {
        portfolioChart.destroy();
    }

    const data = {
        labels: portfolioItems.map(item => item.type),
        datasets: [{
            data: portfolioItems.map(item => item.value),
            backgroundColor: [
                '#2563eb',
                '#93c5fd',
                '#60a5fa',
                '#3b82f6'
            ]
        }]
    };

    portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Returns Calculator
let returnsChart = null;

function calculateReturns() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value);
    const currentValue = parseFloat(document.getElementById('current-value').value);
    const years = parseFloat(document.getElementById('investment-period').value);

    const absoluteReturns = ((currentValue - initialInvestment) / initialInvestment) * 100;
    const cagr = (Math.pow(currentValue / initialInvestment, 1 / years) - 1) * 100;
    const totalGain = currentValue - initialInvestment;

    // Update result summary
    document.getElementById('absolute-returns').textContent = `${Math.round(absoluteReturns * 100) / 100}%`;
    document.getElementById('cagr-returns').textContent = `${Math.round(cagr * 100) / 100}%`;
    document.getElementById('total-gain').textContent = `₹${Math.round(totalGain).toLocaleString()}`;

    // Update chart
    updateReturnsChart(initialInvestment, totalGain);
}

function updateReturnsChart(invested, gain) {
    const ctx = document.getElementById('returns-chart').getContext('2d');
    
    if (returnsChart) {
        returnsChart.destroy();
    }

    returnsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Investment Growth'],
            datasets: [
                {
                    label: 'Initial Investment',
                    data: [invested],
                    backgroundColor: '#2563eb'
                },
                {
                    label: 'Gain',
                    data: [gain],
                    backgroundColor: '#93c5fd'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-calculator`).classList.add('active');
        });
    });

    // Stock Calculator
    let stockChart = null;
    const stockCalculatorForm = document.getElementById('stock-calculator-form');

    if (stockCalculatorForm) {
        stockCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const buyPrice = parseFloat(document.getElementById('stock-buy-price').value);
            const quantity = parseInt(document.getElementById('stock-quantity').value);
            const sellPrice = parseFloat(document.getElementById('stock-sell-price').value);

            const investment = buyPrice * quantity;
            const returns = (sellPrice - buyPrice) * quantity;
            const returnPercentage = (returns / investment) * 100;

            // Update result summary
            const resultDiv = document.getElementById('stock-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Total Investment</h4>
                        <p>₹${investment.toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Returns</h4>
                        <p class="${returns >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ₹${returns.toLocaleString()}
                        </p>
                    </div>
                    <div class="result-item">
                        <h4>Return %</h4>
                        <p class="${returns >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${returnPercentage.toFixed(2)}%
                        </p>
                    </div>
                </div>
            `;

            // Update chart
            updateStockChart(buyPrice, sellPrice);
        });
    }

    function updateStockChart(buyPrice, sellPrice) {
        const ctx = document.getElementById('stock-chart').getContext('2d');
        
        if (stockChart) {
            stockChart.destroy();
        }

        // Generate sample data points
        const data = [];
        const days = 30;
        let currentPrice = buyPrice;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - i));
            
            // Simulate price movement
            const randomChange = (Math.random() - 0.5) * 2;
            currentPrice = i === days - 1 ? sellPrice : currentPrice * (1 + randomChange / 100);

            data.push({
                x: date,
                y: currentPrice
            });
        }

        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Stock Price',
                    data: data,
                    borderColor: '#2563eb',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Position Size Calculator
    const positionCalculatorForm = document.getElementById('position-calculator-form');

    if (positionCalculatorForm) {
        positionCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const capital = parseFloat(document.getElementById('trading-capital').value);
            const riskPercentage = parseFloat(document.getElementById('risk-percentage').value);
            const entryPrice = parseFloat(document.getElementById('entry-price').value);
            const stopLoss = parseFloat(document.getElementById('stop-loss').value);

            const riskAmount = capital * (riskPercentage / 100);
            const riskPerShare = Math.abs(entryPrice - stopLoss);
            const shares = Math.floor(riskAmount / riskPerShare);
            const totalPosition = shares * entryPrice;

            // Update result
            const resultDiv = document.getElementById('position-result');
            resultDiv.innerHTML = `
                <div class="result-item">
                    <h4>Number of Shares</h4>
                    <p>${shares.toLocaleString()}</p>
                </div>
                <div class="result-item">
                    <h4>Total Position</h4>
                    <p>₹${totalPosition.toLocaleString()}</p>
                </div>
                <div class="result-item">
                    <h4>Risk Amount</h4>
                    <p>₹${riskAmount.toLocaleString()}</p>
                </div>
                <div class="result-item">
                    <h4>Risk Per Share</h4>
                    <p>₹${riskPerShare.toFixed(2)}</p>
                </div>
            `;
        });
    }

    // Commodity Trading Calculator
    let commodityChart = null;
    const commodityCalculatorForm = document.getElementById('commodity-calculator-form');

    if (commodityCalculatorForm) {
        commodityCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const commodity = document.getElementById('commodity-type').value;
            const lotSize = parseInt(document.getElementById('lot-size').value);
            const buyPrice = parseFloat(document.getElementById('commodity-buy-price').value);
            const targetPrice = parseFloat(document.getElementById('commodity-target').value);

            const investment = buyPrice * lotSize;
            const expectedReturn = (targetPrice - buyPrice) * lotSize;
            const returnPercentage = (expectedReturn / investment) * 100;

            // Update result summary
            const resultDiv = document.getElementById('commodity-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Total Investment</h4>
                        <p>₹${investment.toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Expected Return</h4>
                        <p class="${expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ₹${expectedReturn.toLocaleString()}
                        </p>
                    </div>
                    <div class="result-item">
                        <h4>Return %</h4>
                        <p class="${expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${returnPercentage.toFixed(2)}%
                        </p>
                    </div>
                </div>
            `;

            // Update chart
            updateCommodityChart(commodity, buyPrice, targetPrice);
        });
    }

    function updateCommodityChart(commodity, buyPrice, targetPrice) {
        const ctx = document.getElementById('commodity-chart').getContext('2d');
        
        if (commodityChart) {
            commodityChart.destroy();
        }

        // Generate sample data points
        const data = [];
        const days = 30;
        let currentPrice = buyPrice;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - i));
            
            // Simulate price movement
            const randomChange = (Math.random() - 0.5) * 2;
            currentPrice = i === days - 1 ? targetPrice : currentPrice * (1 + randomChange / 100);

            data.push({
                x: date,
                y: currentPrice
            });
        }

        commodityChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: `${commodity.charAt(0).toUpperCase() + commodity.slice(1)} Price`,
                    data: data,
                    borderColor: '#2563eb',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-calculator`).classList.add('active');
        });
    });

    // Life Insurance Calculator
    let lifeChart = null;
    const lifeInsuranceForm = document.getElementById('life-insurance-form');

    if (lifeInsuranceForm) {
        lifeInsuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('life-age').value);
            const income = parseFloat(document.getElementById('life-income').value);
            const dependents = parseInt(document.getElementById('life-dependents').value);
            const savings = parseFloat(document.getElementById('life-savings').value);

            // Calculate coverage needs
            const yearsTillRetirement = 60 - age;
            const basicCoverage = income * 10;
            const dependentCoverage = dependents * (income * 5);
            const totalCoverage = basicCoverage + dependentCoverage - savings;

            // Update result summary
            const resultDiv = document.getElementById('life-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Recommended Coverage</h4>
                        <p>₹${Math.round(totalCoverage).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Basic Coverage</h4>
                        <p>₹${Math.round(basicCoverage).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Additional Coverage</h4>
                        <p>₹${Math.round(dependentCoverage).toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Update chart
            updateLifeChart(basicCoverage, dependentCoverage, savings);
        });
    }

    function updateLifeChart(basic, dependent, savings) {
        const ctx = document.getElementById('life-chart').getContext('2d');
        
        if (lifeChart) {
            lifeChart.destroy();
        }

        lifeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Basic Coverage', 'Dependent Coverage', 'Current Savings'],
                datasets: [{
                    data: [basic, dependent, savings],
                    backgroundColor: ['#2563eb', '#93c5fd', '#dbeafe']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Health Insurance Calculator
    const healthInsuranceForm = document.getElementById('health-insurance-form');

    if (healthInsuranceForm) {
        healthInsuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('health-age').value);
            const members = parseInt(document.getElementById('health-members').value);
            const city = document.getElementById('health-city').value;
            const existing = document.getElementById('health-existing').value;

            // Calculate coverage
            let baseCoverage = 500000; // Base 5 lakhs
            
            // Adjust for age
            if (age > 45) baseCoverage *= 1.5;
            
            // Adjust for family size
            baseCoverage *= Math.max(1, members * 0.7);
            
            // Adjust for city tier
            if (city === '1') baseCoverage *= 1.2;
            
            // Adjust for existing conditions
            if (existing === 'yes') baseCoverage *= 1.3;

            const premium = calculateHealthPremium(baseCoverage, age, members, existing === 'yes');

            // Update result
            const resultDiv = document.getElementById('health-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Recommended Coverage</h4>
                        <p>₹${Math.round(baseCoverage).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Estimated Annual Premium</h4>
                        <p>₹${Math.round(premium).toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Update coverage details
            const coverageDiv = document.getElementById('health-coverage');
            coverageDiv.innerHTML = `
                <h4>Coverage Details</h4>
                <ul class="coverage-list">
                    <li>
                        <span>Room Rent Limit</span>
                        <span>₹${Math.round(baseCoverage * 0.02).toLocaleString()} per day</span>
                    </li>
                    <li>
                        <span>ICU Limit</span>
                        <span>₹${Math.round(baseCoverage * 0.04).toLocaleString()} per day</span>
                    </li>
                    <li>
                        <span>Pre/Post Hospitalization</span>
                        <span>30/60 days</span>
                    </li>
                    <li>
                        <span>No Claim Bonus</span>
                        <span>Up to 50%</span>
                    </li>
                </ul>
            `;
        });
    }

    function calculateHealthPremium(coverage, age, members, hasExisting) {
        let premium = coverage * 0.02; // Base 2% of coverage
        
        // Age factor
        if (age > 45) premium *= 1.3;
        if (age > 60) premium *= 1.5;
        
        // Members factor
        premium *= Math.max(1, members * 0.8);
        
        // Existing conditions
        if (hasExisting) premium *= 1.4;
        
        return premium;
    }

    // Term Insurance Calculator
    let termChart = null;
    const termInsuranceForm = document.getElementById('term-insurance-form');

    if (termInsuranceForm) {
        termInsuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('term-age').value);
            const coverage = parseFloat(document.getElementById('term-coverage').value);
            const period = parseInt(document.getElementById('term-period').value);
            const isSmoker = document.getElementById('term-smoker').value === 'yes';

            const premium = calculateTermPremium(age, coverage, period, isSmoker);
            const totalPremium = premium * period;

            // Update result
            const resultDiv = document.getElementById('term-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Annual Premium</h4>
                        <p>₹${Math.round(premium).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Monthly Premium</h4>
                        <p>₹${Math.round(premium/12).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Total Premium</h4>
                        <p>₹${Math.round(totalPremium).toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Update chart
            updateTermChart(coverage, totalPremium);
        });
    }

    function calculateTermPremium(age, coverage, period, isSmoker) {
        let premium = coverage * 0.001; // Base 0.1% of coverage
        
        // Age factor
        if (age > 35) premium *= 1.2;
        if (age > 45) premium *= 1.4;
        
        // Period factor
        if (period > 20) premium *= 1.2;
        
        // Smoker factor
        if (isSmoker) premium *= 1.5;
        
        return premium;
    }

    function updateTermChart(coverage, totalPremium) {
        const ctx = document.getElementById('term-chart').getContext('2d');
        
        if (termChart) {
            termChart.destroy();
        }

        termChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Coverage vs Premium'],
                datasets: [
                    {
                        label: 'Coverage Amount',
                        data: [coverage],
                        backgroundColor: '#2563eb'
                    },
                    {
                        label: 'Total Premium',
                        data: [totalPremium],
                        backgroundColor: '#93c5fd'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Car Insurance Calculator
    const carInsuranceForm = document.getElementById('car-insurance-form');

    if (carInsuranceForm) {
        carInsuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const carValue = parseFloat(document.getElementById('car-value').value);
            const carAge = parseInt(document.getElementById('car-age').value);
            const insuranceType = document.getElementById('car-type').value;
            const ncbPercentage = parseInt(document.getElementById('car-ncb').value);

            const { premium, idv } = calculateCarPremium(carValue, carAge, insuranceType, ncbPercentage);

            // Update result
            const resultDiv = document.getElementById('car-result');
            resultDiv.innerHTML = `
                <div class="result-grid">
                    <div class="result-item">
                        <h4>IDV</h4>
                        <p>₹${Math.round(idv).toLocaleString()}</p>
                    </div>
                    <div class="result-item">
                        <h4>Annual Premium</h4>
                        <p>₹${Math.round(premium).toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Update coverage details
            const coverageDiv = document.getElementById('car-coverage');
            coverageDiv.innerHTML = `
                <h4>Coverage Details</h4>
                <ul class="coverage-list">
                    <li>
                        <span>Own Damage Cover</span>
                        <span>${insuranceType === 'comprehensive' ? '✓' : '✗'}</span>
                    </li>
                    <li>
                        <span>Third Party Cover</span>
                        <span>✓</span>
                    </li>
                    <li>
                        <span>Personal Accident Cover</span>
                        <span>₹15,00,000</span>
                    </li>
                    <li>
                        <span>NCB Discount</span>
                        <span>${ncbPercentage}%</span>
                    </li>
                </ul>
            `;
        });
    }

    function calculateCarPremium(value, age, type, ncb) {
        // Calculate IDV (Insured Declared Value)
        const depreciation = Math.min(50, age * 10); // 10% per year, max 50%
        const idv = value * (1 - depreciation/100);
        
        // Calculate premium
        let premium;
        if (type === 'comprehensive') {
            premium = idv * 0.03; // 3% of IDV for comprehensive
        } else {
            premium = value * 0.01; // 1% of value for third party
        }
        
        // Apply NCB discount
        premium *= (1 - ncb/100);
        
        return { premium, idv };
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate statistics when in view
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');

    function animateStats() {
        stats.forEach(stat => {
            const value = parseInt(stat.textContent.replace(/\D/g, ''));
            let current = 0;
            const increment = value / 30; // Animate over 30 steps
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    current = value;
                    clearInterval(timer);
                }
                stat.textContent = current.toLocaleString() + (stat.textContent.includes('+') ? '+' : '');
                if (stat.textContent.includes('%')) {
                    stat.textContent += '%';
                }
            }, 50);
        });
    }

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Testimonials carousel
    const testimonials = document.querySelector('.testimonials-grid');
    let currentSlide = 0;

    function updateTestimonials() {
        if (window.innerWidth < 768) { // Only activate carousel on mobile
            const slides = document.querySelectorAll('.testimonial-card');
            slides.forEach((slide, index) => {
                slide.style.display = index === currentSlide ? 'block' : 'none';
            });
        } else {
            const slides = document.querySelectorAll('.testimonial-card');
            slides.forEach(slide => {
                slide.style.display = 'block';
            });
        }
    }

    function nextTestimonial() {
        const slides = document.querySelectorAll('.testimonial-card');
        currentSlide = (currentSlide + 1) % slides.length;
        updateTestimonials();
    }

    // Auto advance testimonials every 5 seconds on mobile
    let testimonialInterval;
    function startTestimonialCarousel() {
        if (window.innerWidth < 768) {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        } else {
            clearInterval(testimonialInterval);
        }
    }

    // Initialize and handle resize
    updateTestimonials();
    startTestimonialCarousel();
    window.addEventListener('resize', () => {
        updateTestimonials();
        startTestimonialCarousel();
    });

    // Success Stories Filtering
    const storyFilters = document.querySelectorAll('.story-filter');
    const stories = document.querySelectorAll('.story-card');

    storyFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active filter
            storyFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // Filter stories
            stories.forEach(story => {
                if (category === 'all' || story.dataset.category === category) {
                    story.style.display = 'block';
                    setTimeout(() => story.classList.add('fade-in'), 0);
                } else {
                    story.style.display = 'none';
                    story.classList.remove('fade-in');
                }
            });
        });
    });

    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Add animation to elements
    document.querySelectorAll('.type-card, .story-card, .testimonial-card').forEach(element => {
        animateOnScroll.observe(element);
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Validate form
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/;

            if (!data.name || data.name.length < 2) {
                showError('Please enter a valid name');
                isValid = false;
            }

            if (!emailRegex.test(data.email)) {
                showError('Please enter a valid email address');
                isValid = false;
            }

            if (!phoneRegex.test(data.phone)) {
                showError('Please enter a valid 10-digit phone number');
                isValid = false;
            }

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message fade-in';
                successMessage.textContent = 'Thank you for your message. We will contact you soon!';
                
                const formContainer = contactForm.parentElement;
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
            }
        });
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message fade-in';
        errorDiv.textContent = message;
        
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Add new error message
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
});