import { useExpenses } from "../context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Settings as SettingsIcon, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export function Settings() {
  const { expenses, budgets, currency, setCurrency } = useExpenses();

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    toast.success("Currency updated successfully!");
  };

  const handleExportData = () => {
    const data = {
      expenses,
      budgets,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epurse-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("Data exported successfully!");
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.expenses) {
          localStorage.setItem("expenses", JSON.stringify(data.expenses));
        }
        if (data.budgets) {
          localStorage.setItem("budgets", JSON.stringify(data.budgets));
        }
        
        toast.success("Data imported successfully! Refreshing...");
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    localStorage.removeItem("expenses");
    localStorage.removeItem("budgets");
    toast.success("All data cleared! Refreshing...");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and data
        </p>
      </div>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Preferred Currency Symbol</Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="₹">₹ (Indian Rupee)</SelectItem>
                <SelectItem value="$">$ (US Dollar)</SelectItem>
                <SelectItem value="€">€ (Euro)</SelectItem>
                <SelectItem value="£">£ (British Pound)</SelectItem>
                <SelectItem value="¥">¥ (Japanese Yen)</SelectItem>
                <SelectItem value="₽">₽ (Russian Ruble)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Data</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your expenses and budgets as a backup
            </p>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to JSON
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Import Data</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Restore your data from a previous backup
            </p>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import from JSON
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Clear All Data</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete all expenses and budgets
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your expenses and budgets from this device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllData}>
                    Yes, clear all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-semibold">{expenses.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Active Budgets
              </p>
              <p className="text-2xl font-semibold">{budgets.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Recurring Expenses
              </p>
              <p className="text-2xl font-semibold">
                {expenses.filter((e) => e.isRecurring).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About E-Purse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            E-Purse is a modern personal expense tracker that helps you manage
            your finances efficiently. Track expenses, set budgets, and analyze
            your spending patterns with beautiful visualizations.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Version 2.0.0</span>
            <span>•</span>
            <span>Made with ❤️</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
