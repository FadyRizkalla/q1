const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Function to calculate the average and median
function find4Digits(inputString) {
    const numbers = inputString.split(' '); // Split the string into an array of substrings
    for (const num of numbers) {
        if (/^\d{4}$/.test(num)) { // Check if num matches the pattern of exactly four digits
            return num; // Return the first matching four-digit number
        }
    }
    return false; // Return false if no four-digit number is found
}
function findAverageAndMedian(numbers) {
    if (numbers.length === 0) {
        throw new Error('Array cannot be empty');
    }

    // Calculate the average
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;
   // Calculate the median
    numbers.sort((a, b) => a - b); // Sort the array in ascending order
    const middleIndex = Math.floor(numbers.length / 2);
    let median;

    if (numbers.length % 2 === 0) {
        // Even length: median is the average of the two middle elements
        median = (numbers[middleIndex - 1] + numbers[middleIndex]) / 2;
    } else {
        // Odd length: median is the middle element
        median = numbers[middleIndex];
    }

    return { average, median };
}

// Handle GET requests to "/calculate-sum"

app.get('/find-4-digits', (req, res) => {
    const numbersString = req.query.numbers; // Get the input string from query parameters
    const result = find4Digits(numbersString); // Call the function to find the four-digit number
    res.send(result !== false ? `First four-digit number: ${result}` : 'No four-digit number found'); // Send response to client
});
app.get('/calculate-sum', (req, res) => {
    const n = parseInt(req.query.number, 10);  // Get the number from the query parameters
    if (isNaN(n)) {
        return res.send('Invalid number');
    }
    const sum = calculateSum(n);  // Calculate the sum
    res.send(`The sum of numbers from 1 to ${n} is ${sum}`);  // Send the result back to the client
});

// Handle GET requests to "/capitalize"
app.get('/capitalize', (req, res) => {
    const input = req.query.inputString;  // Get the input string from the query parameters
    const result = capitalizeFirstAndLastLetters(input);  // Process the string
    res.send(`Modified string: ${result}`);  // Send the result back to the client
});

// Handle GET requests to "/average-median"
app.get('/average-median', (req, res) => {
    const numbersString = req.query.numbers;  // Get the numbers string from the query parameters
    const numbers = numbersString.split(',').map(num => parseFloat(num.trim())); // Convert to an array of numbers

    try {
        const { average, median } = findAverageAndMedian(numbers);  // Calculate average and median
        res.send(`Average: ${average}, Median: ${median}`);  // Send the result back to the client
    } catch (error) {
        res.send(error.message);  // Send an error message if something goes wrong
    }
});

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'first.html'));
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
