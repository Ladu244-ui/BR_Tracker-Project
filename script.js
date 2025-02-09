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

// Log Reading Progress
document.getElementById('log-Reading').addEventListener('click', () => {
    const book = document.getElementById('book').value;
    const chapter = document.getElementById('chapter').value;
    const verse = document.getElementById('verse').value;
    //Update progress 
    if(book && chapter && verse) {
      alert(`Logged: ${book} ${chapter}:${verse}`);
      const progress = 0;
        document.getElementById('progress').innerText = `Progress: ${progress}%`;
    }else{

        alert('Please fill in all fields');
    }
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
fte