/**
 * Project: Age Calculator using Luxon
 * Features: npm package integration, date manipulation, input validation.
 */

// 1. Imports
import { DateTime } from "luxon";
import flatpickr from "flatpickr";
import "./style.css"; // Bundled via Vite

// 2. Select DOM Elements
const form = document.getElementById("age-form");
const birthdateInput = document.getElementById("birthdate");
const errorMessage = document.getElementById("error-message");
const resultArea = document.getElementById("result-area");

const yearsDisplay = document.getElementById("years");
const monthsDisplay = document.getElementById("months");
const daysDisplay = document.getElementById("days");

// 3. Initialize Datepicker (Flatpickr)
const fp = flatpickr(birthdateInput, {
    maxDate: "today",       // Prevent selecting future dates
    dateFormat: "Y-m-d",    // ISO standard format for Luxon parsing
    altInput: true,         // Create a user-friendly custom input
    altFormat: "F j, Y",    // Display format: e.g. January 1, 2024
    disableMobile: true     // Use the desktop picker on all devices for consistency
});

// 4. Validation Logic
const validateInput = (value) => {
    if (!value) {
        return "Please select a birthdate.";
    }

    const birthdate = DateTime.fromISO(value);
    const now = DateTime.now();

    if (birthdate > now) {
        return "Birthdate cannot be in the future.";
    }

    return null; // No errors
};

// 5. Calculation Logic
const calculateAge = (dateString) => {
    const birthdate = DateTime.fromISO(dateString);
    const now = DateTime.now();

    // Use Luxon to calculate years, months, and days difference
    const diff = now.diff(birthdate, ["years", "months", "days"]).toObject();

    // Update UI
    yearsDisplay.textContent = Math.floor(diff.years);
    monthsDisplay.textContent = Math.floor(diff.months);
    daysDisplay.textContent = Math.floor(diff.days);

    // Show result section
    resultArea.hidden = false;
};

// 6. Form Submission Event
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedDate = birthdateInput.value;
    const error = validateInput(selectedDate);

    if (error) {
        // Handle Error
        errorMessage.textContent = error;
        resultArea.hidden = true;
        birthdateInput.nextElementSibling.style.borderColor = "#ef4444"; // Highlight secondary flatpickr input
    } else {
        // Clear Error & Calculate
        errorMessage.textContent = "";
        birthdateInput.nextElementSibling.style.borderColor = "#e5e7eb";
        calculateAge(selectedDate);
    }
});
