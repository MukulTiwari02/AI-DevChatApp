import { UserProvider } from "./context/user.context.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer, Bounce } from "react-toastify";

function App() {
  return (
    <UserProvider>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </UserProvider>
  );
}

export default App;
