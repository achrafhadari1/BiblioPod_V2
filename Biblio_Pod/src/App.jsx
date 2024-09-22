import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { SignUp } from "./Pages/SignUp";
import { SignIn } from "./Pages/SignIn";
import { Highlights } from "./Pages/Highlights";
import EpubReader from "./Pages/EpubReader";
import { CircularProgress } from "@nextui-org/react";
import { AuthProvider, useAuthContext } from "./context/AuthContext"; // Import useAuthContext as named export
import { Collection } from "./Pages/Collection/Collection";
import { CollectionLists } from "./Pages/Collection/CollectionLists";
import { Settings } from "./Pages/Settings";
import { Landing } from "./Pages/Landing/Landing";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { user, getUser } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      getUser().finally(() => setLoading(false)); // Set loading to false after fetching user
    } else {
      setLoading(false); // Set loading to false if user exists initially
    }
  }, [user, getUser]);

  if (loading) {
    // Render a loading indicator while fetching user
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CircularProgress size="lg" color="default" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        {/* If the user is authenticated */}
        {user ? (
          <>
            {/* Private routes accessible only when the user is authenticated */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />

            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<HomePage />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/read" element={<EpubReader />} />
            <Route path="/collections/:id" element={<Collection />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Landing" element={<Landing />} />

            <Route path="/collections" element={<CollectionLists />} />
            {/* Add more routes as needed */}
          </>
        ) : (
          <>
            {/* Public routes accessible when the user is not authenticated */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Redirect to home after signup */}
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* Redirect to home for unknown routes */}
          </>
        )}
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
