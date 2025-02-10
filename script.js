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

    const apiKey = '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';
   

document.getElementById("chatgpt-button").addEventListener("click", async () => {
    const question = document.getElementById("chatgpt-input").value.trim();
    if (question) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: question }]
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to fetch response");
            }

            const answer = data.choices?.[0]?.message?.content || "No response received.";
            document.getElementById("chatgpt-response").innerText = answer;

        } catch (error) {
            console.error("Error fetching response:", error);
            document.getElementById("chatgpt-response").innerText = "An error occurred. Please try again.";
        }
    } else {
        alert("Please enter a question");
    }
});
