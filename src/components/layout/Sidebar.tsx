import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "../ui/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { path: "/expenses", icon: Receipt, label: "Expenses" },
  { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  { path: "/budgets", icon: Target, label: "Budgets" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">E-Purse</h1>
              <p className="text-xs text-muted-foreground">Expense Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-lg p-4 border border-violet-500/20">
            <p className="text-sm mb-2">💡 Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Set budgets to track your spending and achieve financial goals!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
