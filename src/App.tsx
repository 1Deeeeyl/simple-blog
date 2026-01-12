import { Routes, Route , Navigate} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;



// try supabase create table and display data
// setup redux