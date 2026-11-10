import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const EyeIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    {open ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L9.88 9.88"
      />
    )}
  </svg>
);

const Login = () => {
  const [mode, setMode] = useState("Sign Up");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const isSignUp = mode === "Sign Up";

  // Already logged in (or just logged in) -> go to home
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const toggleMode = () => {
    setMode(isSignUp ? "Login" : "Sign Up");
    setForm(initialForm);
    setErrors({});
    setShowPassword(false);
  };

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !form.name.trim()) newErrors.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (isSignUp) {
      if (form.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
    } else if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate first
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2. Then call the API
    setLoading(true);
    try {
      const endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
      const payload = isSignUp
        ? { name: form.name.trim(), email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setForm(initialForm);
        setShowPassword(false);
        toast.success(isSignUp ? "Account created!" : "Logged in!");
      }
    } catch (err) {
      console.log("URL:", err.config?.url, "Response:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all focus:border-[#5F6FFF] focus:ring-2 focus:ring-indigo-100 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-14">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {isSignUp ? "Create Account" : "Login"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please {isSignUp ? "sign up" : "log in"} to book an appointment
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`mt-1.5 ${inputClass("name")}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`mt-1.5 ${inputClass("email")}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`pr-11 ${inputClass("password")}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5F6FFF] text-white text-sm font-medium py-3 rounded-full hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? "Already have an account?" : "Create a new account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-[#5F6FFF] font-medium hover:underline"
          >
            {isSignUp ? "Login here" : "Click here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
