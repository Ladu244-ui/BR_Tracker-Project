
// Initialize IndexedDB
let db;

const request = indexedDB.open("ReadingDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB initialized.");
    updateCalendar(); // Populate calendar from IndexedDB
};

request.onerror = (event) => {
    console.error("Error opening IndexedDB:", event.target.error);
};

// Function to log reading progress
document.getElementById("log-Reading").addEventListener("click", () => {
    const bookInput = document.getElementById("book");
    if (!bookInput) return;

    const book = bookInput.value.trim();
    const today = new Date().toISOString().split('T')[0];

    if (!book) {
        alert("Please enter a book name.");
        return;
    }

    alert(`Logged: ${book} on ${today}`);

    const transaction = db.transaction("progress", "readwrite");
    const store = transaction.objectStore("progress");

    const newEntry = { book, date: today };

    store.add(newEntry);

    transaction.oncomplete = () => {
        console.log("Reading logged in IndexedDB.");
        updateCalendar();
    };

    transaction.onerror = () => {
        console.error("Error saving data to IndexedDB.");
    };
});

// Function to update calendar from IndexedDB
function updateCalendar() {
    if (!calendar) return;

    const transaction = db.transaction("progress", "readonly");
    const store = transaction.objectStore("progress");
    const request = store.getAll();

    request.onsuccess = () => {
        const events = request.result.map(entry => ({
            title: entry.book,
            start: entry.date,
            allDay: true
        }));

        calendar.batchRendering(() => {
            calendar.removeAllEvents();
            events.forEach(event => calendar.addEvent(event));
        });
    };

    request.onerror = () => {
        console.error("Error fetching data from IndexedDB.");
    };
}

// Initialize FullCalendar
let calendar;

document.addEventListener("DOMContentLoaded", () => {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
        console.error("Calendar element not found!");
        return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: [] // Initially empty
    });

    calendar.render();
});

