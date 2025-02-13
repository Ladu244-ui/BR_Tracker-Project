// Initialize Lucide icons
lucide.createIcons();

// Handle hint popup
const hintButton = document.getElementById('hint-button');
const hintPopup = document.getElementById('hint-popup');

hintButton.addEventListener('click', () => {
    hintPopup.classList.toggle('show');
});

// Close hint popup when clicking outside
document.addEventListener('click', (e) => {
    if (!hintButton.contains(e.target) && !hintPopup.contains(e.target)) {
        hintPopup.classList.remove('show');
    }
});

// Handle progress bar
const progressFill = document.getElementById('progress-fill');
let progress = 25; // Example progress value
progressFill.style.width = `${progress}%`;

// Handle form submissions
document.body.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM') {
        e.preventDefault();
        // Handle form submission logic here
    }
});

// Simple calendar implementation
class Calendar {
    constructor(container) {
        this.container = container;
        this.date = new Date();
        this.render();
    }

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        let html = `
            <div class="calendar-header">
                <button class="prev-month">&lt;</button>
                <h3>${new Date(year, month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h3>
                <button class="next-month">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>`;

        // Add empty cells for days before the first day of the month
        html += '<div class="day empty"></div>'.repeat(firstDay);

        // Add days of the month
        for (let day = 1; day <= lastDate; day++) {
            html += `<div class="day">${day}</div>`;
        }

        html += '</div>';
        this.container.innerHTML = html;

        // Add event listeners for month navigation
        this.container.querySelector('.prev-month').addEventListener('click', () => this.changeMonth(-1));
        this.container.querySelector('.next-month').addEventListener('click', () => this.changeMonth(1));
    }

    changeMonth(direction) {
        this.date.setDate(1); // Reset to the first day to avoid date overflow issues
        this.date.setMonth(this.date.getMonth() + direction);
        this.render();
    }
}

// Initialize calendar
new Calendar(document.getElementById('calendar'));