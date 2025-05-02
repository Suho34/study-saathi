import { useState } from "react";
import { signUpWithEmail, loginWithGoogle } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      navigate("/"); // or redirect to dashboard later
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Study Saathi – Sign Up Karein
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Apna Email Daalein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password Bharo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Padhai Shuru Karein
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleSignUp}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition w-full"
          >
            Google se Sign Up Karein
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
