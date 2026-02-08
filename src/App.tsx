import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ExpenseProvider } from "./context/ExpenseContext";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ExpenseProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ExpenseProvider>
  );
}

export default App;
