import { scriptures } from './scriptures.js';


// Get today's scripture and display it
function getTodaysScripture() {
    const date = new Date();
    const monthNames = Object.keys(scriptures);
    const month = monthNames[date.getMonth()];
    const day = date.getDate().toString();
    
    const verseText = document.getElementById('verse-text');
    if (!verseText) return; // Ensure element exists

    if (scriptures[month] && scriptures[month][day]) {
        const verseList = scriptures[month][day]
            .map(entry => entry.verse) // Access the "verse" property
            .join(", ");
        verseText.innerHTML = `<strong>${month.charAt(0).toUpperCase() + month.slice(1)} ${day}:</strong> ${verseList}`;
    } else {
        verseText.innerHTML = "No scripture found for today.";
    }
}



// View full monthly reading schedule
document.getElementById("get-reading")?.addEventListener("click", () => {
    const selectedMonth = document.getElementById("month-select")?.value;  // Get the selected month from a dropdown
    if (!selectedMonth) return; // If no month is selected, exit

    const schedule = scriptures[selectedMonth];

    const readingPlan = document.getElementById('reading-plan');
    if (!readingPlan) return;

    if (schedule) {
        readingPlan.innerHTML = Object.entries(schedule)
            .map(([day, verses]) => {
                const verseList = verses.map(verseObj => {
                    const loggedText = verseObj.logged ? "(Read)" : "(Not Read)";
                    return `${verseObj.verse} ${loggedText}`;
                }).join(", ");
                return `<strong>${selectedMonth} ${day}:</strong> ${verseList}`;
            })
            .join("<br>");
    } else {
        readingPlan.innerHTML = "No schedule found for this month.";
    }
});


document.addEventListener('DOMContentLoaded', () => {
    getTodaysScripture();
    //updateProgressDisplay();
});


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

function logScripture(month, index) {
    scriptures[month][index].logged = true; // Mark the scripture as logged
    updateProgress(month);
  }

  function updateProgress(month) {
    // Update daily progress (based on the current day's scripture being read)
    const dailyProgress = scriptures[month].filter(scripture => scripture.logged).length;
    const dailyPercentage = (dailyProgress / scriptures[month].length) * 100;
    document.getElementById('verse-text').innerText = `Daily Progress: ${dailyPercentage}%`;
  
    // Update monthly progress
    const monthlyProgress = calculateMonthlyProgress(month);
    document.getElementById('monthly-progress').innerText = `Monthly Progress: ${monthlyProgress}%`;
  
    // Optionally, you could also update a progress bar
    document.getElementById('monthly-progress-bar').style.width = `${monthlyProgress}%`;
  }
  
  // Update Monthly Progress (assuming loggedReadings is tracked)
  const loggedReadings = [];

  // Example of a button click handler for logging a verse
  document.getElementById("log-Reading").addEventListener("click", () => {
      const bookInput = document.getElementById("book");
      const book = bookInput.value.trim();  // Scripture entered by the user
      const today = new Date().toISOString().split('T')[0];  // Today's date in YYYY-MM-DD format
  
      // Assuming we are logging the reading for today
      const day = new Date().getDate();  // Get today's date (e.g., 1, 2, 3, etc.)
  
      // Update the scriptures object
      for (const month in scriptures) {
          for (const date in scriptures[month]) {
              if (date == day) {
                  // Find the verse for the day and mark it as logged
                  scriptures[month][date].forEach(verse => {
                      if (verse.verse === book) {
                          verse.logged = true;  // Mark it as read (logged)
                      }
                  });
              }
          }
      }
  
      // Add the logged verse to the loggedReadings array
      loggedReadings.push({ book, date: today });
  
      console.log("Logged Readings:", loggedReadings);
  
      // You can also update the progress bar and other UI elements here
      updateProgressBar();
  });
  

function updateProgressBar() {
    let totalVerses = 0;
    let loggedVerses = 0;

    for (const monthKey in scriptures) {
        for (const dayKey in scriptures[monthKey]) {
            totalVerses += scriptures[monthKey][dayKey].length;
            loggedVerses += scriptures[monthKey][dayKey].filter(verse => verse.logged).length;
        }
    }

    const progress = (loggedVerses / totalVerses) * 100;
    document.getElementById('monthly-progress').textContent = `Monthly Progress: ${progress.toFixed(2)}%`;
    document.getElementById('monthly-progress-bar').style.width = `${progress}%`;
}

//  ChatGPT API Integration
/*const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key

document.getElementById("chatgpt-button")?.addEventListener("click", async () => {
    const question = document.getElementById("chatgpt-input")?.value.trim();
    if (!question) {
        alert("Please enter a question.");
        return;
    }

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
        if (!response.ok) throw new Error(data.error?.message || "Failed to fetch response");

        document.getElementById("chatgpt-response").innerText = data.choices?.[0]?.message?.content || "No response received.";
    } catch (error) {
        console.error("Error fetching response:", error);
        document.getElementById("chatgpt-response").innerText = "An error occurred. Please try again.";
    }
});*/
// Add hover effect to prevent container overlap
document.querySelectorAll('.floating-container').forEach(container => {
    container.addEventListener('mouseenter', () => {
        container.style.zIndex = '50';
    });
    container.addEventListener('mouseleave', () => {
        // Small delay to make the transition smoother
        setTimeout(() => {
            container.style.zIndex = '1';
        }, 500);
    });
});
// Add functionality to the View button
document.querySelector('.timetable button').addEventListener('click', () => {
    const month = document.querySelector('.timetable select').value;
    console.log('Viewing:', month);
});
// Add functionality to the search
document.querySelector('.search-container input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value;
        console.log('Searching for:', searchTerm);
    }
});
document.querySelector('.search-container button').addEventListener('click', () => {
    const searchTerm = document.querySelector('.search-container input').value;
    console.log('Searching for:', searchTerm);
});

