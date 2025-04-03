import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("/users/register", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);

        localStorage.setItem("token", res.data.token);
        document.cookie = `jwt=${res.data.token}`;

        setUser(res.data.user);

        navigate("/dashboard");
        navigate(0);
      })
      .catch((err) => {
        toast.error("Some error occurred. Please try again.");
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041f1c]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#054640] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-[#ece5dd] mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 rounded bg-[#075e54] text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#ece5dd] mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 rounded bg-[#075e54] text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-[#25D366] text-white focus:outline-none focus:ring-0 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-[#ece5dd] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#25D366] hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
