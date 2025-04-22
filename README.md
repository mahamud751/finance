Personal Finance Tracker
A Next.js web application for tracking personal finances, including viewing transactions, adding/editing transactions, filtering, and visualizing income vs. expenses.
Features

Dashboard: View total income, expenses, balance, and a pie chart.
Transaction List: Paginated list with edit/delete options.
Add/Edit Transactions: Form to create or update transactions.
Filtering: Filter transactions by category or date range.
State Management: Uses Redux Toolkit.
API Integration: Mock API with static data.
Data Visualization: Recharts for income vs. expenses chart.
Error Handling: User-friendly error messages.
Performance: Server Components and dynamic imports.

Setup

Clone the repository: git clone <repo-url>
Install dependencies: npm install
Run the development server: npm run dev
Open http://localhost:3000 in your browser.

Mock API
The API is mocked using static data in lib/api.ts. It simulates the following endpoints:

GET /transactions: List transactions with optional filters.
GET /transactions/:id: Get a single transaction.
POST /transactions: Create a transaction.
PATCH /transactions/:id: Update a transaction.
DELETE /transactions/:id: Delete a transaction.
GET /summary: Get summary data.

Assumptions

Used static mock data instead of JSON Server for simplicity.
Pagination is basic (Previous/Next buttons) due to mock data limitations.
Focused on core requirements; infinite scroll and dark mode were not implemented due to time constraints.

Challenges

Mock API: Simulating pagination and filtering with static data required careful state management.
Solution: Implemented robust filtering logic in lib/api.ts and used Redux for consistent state.

Running Tests

Install test dependencies: npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest
Run tests: npm test

Dependencies

Next.js (15.3.1)
TypeScript
Tailwind CSS
Redux Toolkit
Axios
Recharts
Jest (for testing)
