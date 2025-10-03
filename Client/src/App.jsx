import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FloatingMenu from "./components/FloatingMenu";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import EditProperty from "./pages/EditProperty";
import BrowseProperties from "./pages/BrowseProperties";
import ChatInbox from "./pages/ChatInbox";
import PageTransition from "./components/PageTransition";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <FloatingMenu />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<BrowseProperties />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/edit-property/:id" element={<EditProperty />} />
                <Route path="/chat" element={<ChatInbox />} />
                <Route path="*" element={<div className="flex items-center justify-center h-64"><h2 className="text-2xl text-gray-600">Page Not Found</h2></div>} />
              </Routes>
            </PageTransition>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  maxWidth: '500px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
