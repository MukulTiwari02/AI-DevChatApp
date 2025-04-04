import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCode, FaComments, FaLightbulb } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import axios from "../config/axios.js";

const LandingPage = () => {
  const navigate = useNavigate();
  const innerWidth = window.innerWidth;
  const particles = innerWidth > 640 ? 250 : 150;
  console.log(innerWidth);
  const { user, setUser } = useContext(UserContext);

  const particlesInit = async (main) => {
    await loadSlim(main);
  };

  async function getUser() {
    try {
      const response = await axios.get(`/users/profile`);
      if (!response) return;
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const navigateUserToDashboard = async () => {
    if (!user) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div className="select-none relative bg-[#075E54] text-white min-h-screen flex flex-col items-center justify-center px-6 pt-3 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: "#041f1c",
          },
          particles: {
            number: {
              value: particles,
            },
            size: {
              value: 2,
            },
            move: {
              enable: true,
              speed: 3,
            },
            links: {
              enable: true,
              color: "#128c7e",
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              repulse: {
                distance: 100,
              },
              push: {
                quantity: 4,
              },
            },
          },
        }}
        className="absolute inset-0"
      />

      <div className="w-full sm:h-38 h-20 flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="sm:w-38 sm:h-38 z-10 h-30 w-30 -ml-8"
        />
      </div>
      <motion.h1
        className="text-4xl sm:text-5xl mx-auto text-center font-extrabold text-[#25D366] mb-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to AI Developer Chat
      </motion.h1>

      <motion.p
        className="text-md sm:text-lg text-[#faf6f2] mb-6 max-w-lg text-center relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Streamline your workflow with real-time collaboration, project-localized
        chat, and AI-powered development.
      </motion.p>

      <motion.button
        onClick={navigateUserToDashboard}
        whileTap={{ scale: 0.95 }}
        className="bg-[#25D366] hover:bg-[#dcf8c6] hover:scale-105 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-md sm:text-lg shadow-md transition-all mb-8 relative z-10"
      >
        Get Started
      </motion.button>

      <div className="md:grid flex flex-col md:h-fit justify-center md:grid-cols-3 gap-6 text-center  max-w-xs sm:max-w-4xl relative z-10 ">
        <motion.div
          className="p-6 bg-[#005d4b] flex-1 rounded-xl shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaCode className="text-[#25D366] text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-md sm:text-xl font-bold">AI-Assisted Coding</h3>
          <p className="text-white/60 text-sm">
            Boost efficiency with AI-powered coding assistance.
          </p>
        </motion.div>

        <motion.div
          className="p-6 bg-[#005d4b] flex-1 rounded-xl shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaComments className="text-[#25D366] text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-md sm:text-xl font-bold">Real-Time Collaboration</h3>
          <p className="text-white/60 text-sm">
            Work together with instant communication.
          </p>
        </motion.div>

        <motion.div
          className="p-6 bg-[#005d4b] flex-1 rounded-xl shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaLightbulb className="text-[#25D366] text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-md sm:text-xl font-bold">Intelligent Suggestions</h3>
          <p className="text-white/60 text-sm">
            Receive smart recommendations to enhance productivity.
          </p>
        </motion.div>
      </div>

      <footer className="sm:mt-auto mt-12 text-[#ece5dd] text-sm pb-2 z-10">
        &copy; 2025 AI Developer Chat. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
