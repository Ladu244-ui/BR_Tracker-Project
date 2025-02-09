// Fetch Verse of the Day
async function fetchVerseOfTheDay() {
    try {
        const response = await fetch('https://bible-api.com/random');
        const data = await response.json();
        document.getElementById('verse-text').innerHTML = `${data.reference}:${data.text}`;
    }catch(error) {
        console.error('Error fetching verse:',error);
    }
    
}
//Initialize progress in local storage
if(!localStorage.getItem('progress')) {
    localStorage.setItem('progress',JSON.stringify([]));
}
// Log Reading Progress
document.getElementById('log-Reading').addEventListener('click', () => {
    const book = document.getElementById('book').value;
    const chapter = document.getElementById('chapter').value;
    const verse = document.getElementById('verse').value;
    //Update progress 
    if(book && !isNaN(chapter) && !isNaN(verse)) {
      alert(`Logged: ${book} ${chapter}:${verse}`);
      const progress = JSON.parse(localStorage.getItem('progress'));
        progress.push({book,chapter,verse});
        localStorage.setItem('progress',JSON.stringify(progress));

        //Update progress display
       updateProgressDisplay();
       alert(`Logged ${book} ${chapter}:${verse}`); 
    }else{

        alert('Please fill in all fields');
    }
});

//Function to Calculate and display progress
function updateProgressDisplay() {
    const progress = JSON.parse(localStorage.getItem('progress'));
    const totalVerses = 31102; // Total verses in the Bible (approximate)
    const uniqueVerses = new Set(progress.map((entry) => `${entry.book}-${entry.chapter}-${entry.verse}`)).size;
    const percentage = ((uniqueVerses / totalVerses) * 100).toFixed(2);
  
    document.getElementById('progress').innerText = `Progress: ${percentage}%`;
  }
  
  // Initialize progress display on page load
  updateProgressDisplay();

//search functionality
document.getElementById('search-button').addEventListener('click', async() => {
    const query = document.getElementById('search-input').value;
    if(query) {
        try {
            const response = await fetch(`https://bible-api.com/${query}`);
            const data = await response.json();
            document.getElementById('search-results').innerText = `${data.reference}:${data.text}`;
        }catch(error) {
            console.error('Error searching:',error);
        }
    }else{
        alert('Please enter a search term');
    }
});

//Fetch Verse of the Day
fetchVerseOfTheDay();

document.addEventListener('DOMContentLoaded', () => {
    const calenderE1 = document.getElementById('calender');
    const calender =  new FullCalendar.Calendar(calenderE1, {
        initialView: 'dayGridMonth',
        events: []
    });

    calender.render();

    // Load saved readings from localStorage
    const progress = JSON.parse(localStorage.getItem('progress')) || [];
    progress.forEach((entry) => {
        addReadingToClaneder(entry.book, entry.chapter, entry.verse, new Date());
      });

      function addReadingToClaneder(book, chapter, verse, date) {
        const event = {
          title: `${book} ${chapter}:${verse}`,
          start: date,
          allDay: true, 
        };
        calender.addEvent(event);
      }
    });
