import { useExpenses } from "../context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  getTotalExpense,
  getCategorySummary,
  formatCurrency,
  getBudgetProgress,
} from "../utils/expenseUtils";
import { Progress } from "../components/ui/progress";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

export function Dashboard() {
  const { expenses, budgets, currency } = useExpenses();

  // Get current month expenses
  const currentDate = new Date();
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Get previous month expenses for comparison
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  );
  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === previousMonth.getMonth() &&
      expenseDate.getFullYear() === previousMonth.getFullYear()
    );
  });

  const currentMonthTotal = getTotalExpense(currentMonthExpenses);
  const previousMonthTotal = getTotalExpense(previousMonthExpenses);
  const percentageChange =
    previousMonthTotal === 0
      ? 100
      : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;

  const totalExpenses = getTotalExpense(expenses);
  const categorySummary = getCategorySummary(currentMonthExpenses);
  const topCategories = Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent expenses
  const recentExpenses = expenses.slice(0, 5);

  // Budget alerts
  const budgetAlerts = budgets
    .map((budget) => ({
      budget,
      progress: getBudgetProgress(budget, expenses),
    }))
    .filter((item) => item.progress.percentage > 80);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatCurrency(currentMonthTotal, currency)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {percentageChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-green-500" />
              )}
              <p className="text-xs text-muted-foreground">
                {Math.abs(percentageChange).toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatCurrency(totalExpenses, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Budgets</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{budgets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetAlerts.length} need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg. Daily Spend</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatCurrency(
                Math.round(currentMonthTotal / currentDate.getDate()),
                currency
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetAlerts.map(({ budget, progress }) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{budget.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(progress.spent, currency)} /{" "}
                    {formatCurrency(budget.limit, currency)}
                  </span>
                </div>
                <Progress
                  value={progress.percentage}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {progress.percentage.toFixed(0)}% of budget used
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map(([category, amount]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{category}</span>
                      <span className="text-sm">
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>
                    <Progress
                      value={(amount / currentMonthTotal) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No expenses this month
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link to="/expenses">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm">{expense.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm">
                      {formatCurrency(expense.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No expenses yet. Start tracking!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/expenses">
              <Button>Add Expense</Button>
            </Link>
            <Link to="/budgets">
              <Button variant="outline">Set Budget</Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
