import { Expense, Budget } from "../context/ExpenseContext";

export function getTotalExpense(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getCategorySummary(
  expenses: Expense[]
): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
}

export function getMonthlySummary(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
}

export function getExpensesByDateRange(
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return expenseDate >= start && expenseDate <= end;
  });
}

export function getExpensesByCategory(
  expenses: Expense[],
  category: string
): Expense[] {
  return expenses.filter((expense) => expense.category === category);
}

export function getBudgetProgress(
  budget: Budget,
  expenses: Expense[]
): { spent: number; percentage: number; remaining: number } {
  const now = new Date();
  let filteredExpenses = expenses.filter(
    (e) => e.category === budget.category
  );

  // Filter by period
  if (budget.period === "monthly") {
    filteredExpenses = filteredExpenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });
  } else if (budget.period === "weekly") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    filteredExpenses = filteredExpenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= weekStart;
    });
  } else if (budget.period === "yearly") {
    filteredExpenses = filteredExpenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() === now.getFullYear();
    });
  }

  const spent = getTotalExpense(filteredExpenses);
  const percentage = (spent / budget.limit) * 100;
  const remaining = budget.limit - spent;

  return { spent, percentage, remaining };
}

export function searchExpenses(
  expenses: Expense[],
  query: string
): Expense[] {
  const lowerQuery = query.toLowerCase();
  return expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(lowerQuery) ||
      expense.note.toLowerCase().includes(lowerQuery) ||
      expense.amount.toString().includes(lowerQuery)
  );
}

export const CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Rent",
  "Transport",
  "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "hsl(var(--chart-1))",
  Travel: "hsl(var(--chart-2))",
  Bills: "hsl(var(--chart-3))",
  Shopping: "hsl(var(--chart-4))",
  Entertainment: "hsl(var(--chart-5))",
  Healthcare: "hsl(10, 80%, 60%)",
  Education: "hsl(200, 80%, 60%)",
  Rent: "hsl(280, 80%, 60%)",
  Transport: "hsl(40, 80%, 60%)",
  Other: "hsl(0, 0%, 60%)",
};

export function formatCurrency(amount: number, currency: string = "₹"): string {
  return `${currency}${amount.toLocaleString()}`;
}
