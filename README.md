# Personal Expense Tracker

A complete React Native mobile app built with Expo for tracking income and expenses. Features categorization, monthly reports, charts, and PDF export.

## Features

### Core Features
- **Add Transaction** – Title, amount, type (Income/Expense), category, date, optional note
- **Transaction List** – Visual distinction for income (green) vs expense (red)
- **Category-wise Spending** – Grouped totals per category with progress bars
- **Monthly Report** – Total income, total expense, remaining balance
- **Charts** – Pie chart for category spending, bar chart for monthly expenses
- **Export Report** – PDF export and share via expo-print and expo-sharing

### Extra Features
- **Dark Mode** – Automatic light/dark theme based on system preference
- **Filter Transactions** – Filter by date range
- **Edit & Delete** – Long-press to delete, tap to edit
- **Persistent Storage** – AsyncStorage for data persistence

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Storage:** AsyncStorage
- **Navigation:** Expo Router (React Navigation)
- **Charts:** react-native-chart-kit
- **PDF Export:** expo-print, expo-sharing

## Project Structure

```
├── app/
│   ├── (tabs)/           # Tab screens
│   │   ├── index.tsx     # Dashboard
│   │   ├── add.tsx       # Add Transaction
│   │   ├── history.tsx   # Transaction History
│   │   └── reports.tsx   # Reports & Charts
│   ├── modal.tsx         # Edit Transaction (modal)
│   └── _layout.tsx       # Root layout
├── components/           # Reusable UI components
├── contexts/             # React contexts (TransactionContext)
├── hooks/                # Custom hooks
├── storage/              # AsyncStorage logic
├── types/                # TypeScript types
└── utils/                # Formatting, PDF export
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on Web
npx expo start --web
```

## Categories

**Expense:** Food, Transport, Shopping, Bills, Others  
**Income:** Salary, Others
