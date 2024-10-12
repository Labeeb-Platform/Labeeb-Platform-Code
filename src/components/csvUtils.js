import Papa from 'papaparse';

// Function to read and parse the CSV file
export const readCSVFile = (file, callback) => {
  Papa.parse(file, {
    header: true, // Use the first row as the header
    dynamicTyping: true, // Automatically type data
    complete: function (results) {
      callback(results.data); // Pass the parsed data to the callback
    },
  });
};
