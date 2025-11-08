export const scriptures = {
  January: {
    1: ["Luke 1:46-55", "Isaiah 55:6-13"],
    2: ["Luke 4:43-5:18", "Psalms 33;65;67;47", "1 Chronicles 1:1-5:26"],
    3: ["Luke 5:19-47", "Genesis 11:10-12:20", "1 Chronicles 5:27-9:34"],
    4: ["John 6:1-21", "Genesis 13-14", "1 Chronicles 9:35-11:9"],
    5: ["John 6:22-35", "Genesis 15-16", "1 Chronicles 11:10-12:23"],
    6: ["John 6:35-59", "Genesis 17:1-18:15"],
    7: ["John 6:60-7:14-36", "Genesis 18:16-19:29", "1 Chronicles 16:24-14:17"],
    8: ["John 7:14-36", "Genesis 19:30-20:18", "1 Chronicles 15:1-16:6"],
    9: ["John 7:37-8:11", "Genesis 21", "1 Chronicles 16:7-43"],
    10: ["John 10:1-21", "Genesis 22-23", "1 Chronicles 17:1-18:13"],
    11: ["John 8:37-59", "Psalms 23;4;128;91;96", "1 Chronicles 18:14-20:8"],
    12: ["John 9", "Genesis 24", "1 Chronicles 21:1-27"],
    13: ["John 10:1-21", "Genesis 25", "1 Chronicles 21:28-22:19"],
    14: ["John 10:22-42", "Genesis 26:1-33", "1 Chronicles 23-27"],
    15: ["John 11:1-44", "Genesis 26:34-27:40", "1 Chronicles 24b-28"],
    16: ["John 11:45-12:8", "Genesis 27:11-28:12", "1 Chronicles 29"],
    17: ["John 12:9-26", "Genesis 29:1-30:13", "2 Chronicles 1-2"],
    18: ["John 12:27-50", "Genesis 30:14-43", "2 Chronicles 3:1-5:1"],
    19: ["John 13:1-30", "Genesis 31:1-42", "2 Chronicles 5:2-6:11"],
    20: ["John 13:31-14:14", "Genesis 31:43-32:21", "2 Chronicles 6:12-7:3"],
    21: ["John 14:15-31", "Genesis 32:22-33:20", "2 Chronicles 7:4-8:18"],
    22: ["John 15:1-17", "Genesis 34", "2 Chronicles 9"],
    23: ["John 15:18-16:15", "Genesis 35", "2 Chronicles 10-11"],
    24: ["John 16:16-35", "Genesis 36", "2 Chronicles 12-13"],
    25: ["John 17", "Ephesians 4:1-7.11-16", "Ezekiel 37:15-28"],
    26: ["John 18:1-27", "Genesis 37", "2 Chronicles 12-13"],
    27: ["John 18:28-19:16", "Genesis 38", "2 Chronicles 17:1-19:3"],
    28: ["John 19:17-42", "Genesis 39-40", "2 Chronicles 19:4-20:37"],
    29: ["John 20:1-18", "Genesis 41:1-52", "2 Chronicles 21:1-22:9"],
    30: ["John 20:19-31", "Genesis 41:53-42:38", "2 Chronicles 22:10-23:21"],
    31: ["John 21", "Genesis 43:1-44:13", "2 Chronicles 24"]
  },
  February: {
    1: ["Romans 1:1-17", "Genesis 44:14-45:28", "2 Chronicles 25"],
    2: ["Romans 1:18-32", "Genesis 46:1-47:12", "2 Chronicles 26-27"],
    3: ["Romans 2:1-16", "Genesis 47:13-48:22", "2 Chronicles 28"],
    4: ["Romans 2:17-3:8", "Genesis 48:23-49:27 (G49:1-28)", "2 Chronicles 29"],
    5: ["Romans 3:9-31", "Genesis 49:28-end", "2 Chronicles 30:1-31:1"],
    6: ["Romans 4", "Psalms 25;111;142(Joseph);146", "2 Chronicles 31:2-21"],
    7: ["Romans 5", "Psalms 105;124;129", "2 Chronicles 32"],
    8: ["Romans 6", "Exodus 1:1-2:15", "2 Chronicles 33"],
    9: ["Romans 7", "Exodus 2:16-3:22", "2 Chronicles 34"],
    10: ["Romans 8:1-17", "Exodus 4", "2 Chronicles 35"],
    11: ["Romans 8:18-39", "Exodus 5:1-6:13", "2 Chronicles 36"],
    12: ["Romans 9", "Exodus 6:14-7:25", "Amos 1-2"],
    13: ["Romans 10:1-11:6", "Exodus 7:26-8:28 (G Ch. 8)", "Amos 3-4"],
    14: ["Romans 11:7-36", "Exodus 9", "Amos 5-6"],
    15: ["Romans 12", "Exodus 10", "Amos 7-9L"]
  },
  // Add more months as needed - copying structure from your scriptures.js
};

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const getTodaysScripture = () => {
  const date = new Date();
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString();
  
  if (scriptures[month] && scriptures[month][day]) {
    return {
      month,
      day,
      verses: scriptures[month][day],
    };
  }
  
  return null;
};

export const getMonthScriptures = (monthName) => {
  return scriptures[monthName] || null;
};
