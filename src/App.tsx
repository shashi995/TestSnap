import router from "./routes";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
