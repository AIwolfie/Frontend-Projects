# Age Calculator (Luxon & Flatpickr)

A modern, accurate age calculator built using **Vanilla JavaScript**, **npm**, and **Vite**. This project focuses on professional date manipulation using the **Luxon** library and accessible user inputs with **Flatpickr**.

## 🚀 Features
- **Precise Calculation:** Uses Luxon to calculate age down to the exact year, month, and day.
- **Modern Datepicker:** Integrated Flatpickr to ensure a consistent and accessible UI (disabling future dates).
- **Validation:** Handles empty inputs and future date selections with accessible error messages.
- **Premium UI:** A responsive, mobile-first card design with smooth animations and high-impact typography.
- **Vite Bundler:** Optimized for development speed and efficient production builds.

## 🛠 Tech Stack
- **Engine:** Vanilla JavaScript (ES6+ Modules)
- **Date Management:** [Luxon](https://moment.github.io/luxon/)
- **Datepicker:** [Flatpickr](https://flatpickr.js.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS3

## 📂 Project Structure
```text
age-calculator/
├── index.html    # Semantic structure
├── style.css     # Design system & component styles
├── main.js       # Core logic, Luxon implementation, & validation
└── package.json  # Dependency management & build scripts
```

## 📖 Installation & Setup

1. **Install Dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 🔖 Lessons Learned
- Integrating third-party libraries using npm and ES6 modules.
- The power of Luxon's `diff()` and `Interval` for complex date math.
- Handling accessible focus management in complex UI components like datepickers.
- Creating a seamless user experience using micro-animations and validation feedback.
