import { useExpenses } from "../context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CATEGORIES, formatCurrency, getBudgetProgress } from "../utils/expenseUtils";
import { Plus, Trash2, Edit, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { Budget } from "../context/ExpenseContext";

export function Budgets() {
  const { budgets, expenses, addBudget, updateBudget, deleteBudget, currency } =
    useExpenses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [formData, setFormData] = useState({
    category: "Food",
    limit: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.limit || Number(formData.limit) <= 0) {
      toast.error("Please enter a valid budget limit");
      return;
    }

    const budgetData: Budget = {
      id: editingBudget ? editingBudget.id : Date.now(),
      category: formData.category,
      limit: Number(formData.limit),
      period: formData.period,
    };

    if (editingBudget) {
      updateBudget(budgetData);
      toast.success("Budget updated successfully!");
    } else {
      addBudget(budgetData);
      toast.success("Budget added successfully!");
    }

    setIsDialogOpen(false);
    setEditingBudget(null);
    setFormData({ category: "Food", limit: "", period: "monthly" });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteBudget(id);
    toast.success("Budget deleted successfully!");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
    setFormData({ category: "Food", limit: "", period: "monthly" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track spending limits for different categories
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Add New Budget"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Budget Limit</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBudget ? "Update Budget" : "Add Budget"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No budgets yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by creating a budget to track your spending
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget, expenses);
            const isOverBudget = progress.percentage > 100;
            const isNearLimit = progress.percentage > 80 && !isOverBudget;

            return (
              <Card
                key={budget.id}
                className={
                  isOverBudget
                    ? "border-destructive bg-destructive/5"
                    : isNearLimit
                    ? "border-orange-500 bg-orange-500/5"
                    : ""
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{budget.category}</CardTitle>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {budget.period}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold">
                      {formatCurrency(progress.spent, currency)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of {formatCurrency(budget.limit, currency)}
                    </span>
                  </div>

                  <Progress
                    value={Math.min(progress.percentage, 100)}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={
                        isOverBudget
                          ? "text-destructive"
                          : isNearLimit
                          ? "text-orange-500"
                          : "text-muted-foreground"
                      }
                    >
                      {progress.percentage.toFixed(0)}% used
                    </span>
                    <span
                      className={
                        isOverBudget
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {isOverBudget ? (
                        <>Over by {formatCurrency(Math.abs(progress.remaining), currency)}</>
                      ) : (
                        <>{formatCurrency(progress.remaining, currency)} left</>
                      )}
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-xs text-destructive">
                        Budget exceeded!
                      </span>
                    </div>
                  )}

                  {isNearLimit && (
                    <div className="flex items-center gap-2 p-2 bg-orange-500/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-orange-500">
                        Approaching limit
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
