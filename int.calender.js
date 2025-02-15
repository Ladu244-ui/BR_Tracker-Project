let calendar;

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        console.error("Calendar element not found!");
        return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: []
    });

    calendar.render();
});

// Function to update the calendar with stored progress
function updateCalendar() {
    if (!calendar) return;

    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    const events = Object.entries(progress).flatMap(([date, entries]) =>
        entries.map(entry => ({
            title: entry.book,
            start: date,
            allDay: true
        }))
    );

    calendar.batchRendering(() => {
        calendar.removeAllEvents();
        events.forEach(event => calendar.addEvent(event));
    });
}

//Log Reading Progress
document.getElementById('log-Reading').addEventListener('click', () => {
    const bookInput = document.getElementById('book');
    if (!bookInput) return;

    const book = bookInput.value.trim();
    const today = new Date().toISOString().split('T')[0];

    if (!book) {
        alert('Please enter a book name.');
        return;
    }

    alert(`Logged: ${book} on ${today}`);

    // Insert reading progress into SQLite
    db.run("INSERT INTO progress (date, book) VALUES (?, ?)", [today, book]);

    updateCalendar(); // Now this should read from SQLite
});

