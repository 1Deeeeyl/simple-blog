import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";

import supabase from "./utils/supabase";
import { setUser, clearUser } from "./features/auth/authSlice";

import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import YourBlogs from "./pages/yourBlogs/YourBlogs";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import BlogPage from "./pages/blogPage/BlogPage";
import NewBlog from "./pages/blogPage/NewBlog";
import UpdateBlog from "./pages/blogPage/UpdateBlog";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setUser(data.session?.user ?? null));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user ?? null));
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);


  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
      return;
    }
    dispatch(clearUser());
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />

      {/* 📍 Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<BlogPage />} />

        <Route
          path="/signin"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/yourblogs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <YourBlogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/newblog"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/yourblogs/:id/edit"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UpdateBlog />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
