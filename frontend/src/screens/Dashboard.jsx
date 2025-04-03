import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios.js";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [projectName, setProjectName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectAdded, setProjectAdded] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  async function createProject(e) {
    e.preventDefault();
    if (projectName == "") return toast.error("Project name is required");
    try {
      await axios.post("/project/create", { name: projectName });
      setIsModalOpen(false);
      setProjectName("");
      setProjectAdded((e) => e + 1);
      toast.success("Project Created Sucessfully.");
    } catch (error) {
      toast.error("Some error occured.");
      console.log(error);
    }
  }

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`/users/profile`);
        if (!response) navigate("/login");
        setUser(response.data.user);
      } catch (error) {
        toast.error("Unauthorized, Please Login");
        navigate("/login");
      }
    }
    if (!user) getUser();
  }, []);

  async function fetchProjects() {
    try {
      const response = await axios.get("/project/allProjects");
      setProjects(response.data.projects);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [user, projectAdded]);

  const logoutUser = async () => {
    try {
      localStorage.removeItem("token");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await axios.get("/users/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="select-none p-10 min-h-screen bg-[#041f1c] text-[#faf6f2] relative">
      <div className="flex justify-between items-center mb-6 h-20">
        <div
          className="h-full w-fit cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="h-full object-fill scale-175" />
          <span className="text-3xl font-bold text-[#25D366]">
            AI Developer Chat
          </span>
        </div>
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-[#005d4b] flex items-center justify-center text-white text-lg cursor-pointer"
            >
              {user.email[0].toUpperCase()}
            </button>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 min-w-48 max-w-fit bg-[#075e54] shadow-md rounded-md p-2"
              >
                <p className="text-[#dcf8c6] px-3 py-2">{user?.email}</p>
                <button
                  onClick={logoutUser}
                  className="cursor-pointer w-full text-left px-3 py-2 hover:bg-[#128c7e] rounded-md"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <h2 className="text-4xl font-bold text-[#faf6f2] mb-6">My Projects</h2>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search projects . . ."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 w-full max-w-lg rounded-md border border-[rgba(128,221,210,0.7)] text-[rgb(255,255,255)] placeholder:text-white/60 focus:outline-none focus:ring-0 focus:ring-[#25D366]"
        />
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.1 }}
          className="ml-4 px-4 py-2 bg-[#25d366] rounded-md text-[#041f1c] font-semibold text-md active:scale-95"
        >
          + New
        </motion.button>
      </div>

      <div className="space-y-4">
        {projects.length > 0 &&
          projects
            .filter((project) =>
              project.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((project) => (
              <motion.div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                whileHover={{ backgroundColor: "#054640" }}
                className="p-5 bg-[#003b30] rounded-md cursor-pointer"
              >
                <h3 className="text-lg font-bold text-[#ece5dd]">
                  {project.name.toUpperCase()}
                </h3>
                <p className="text-gray-400 text-sm">
                  Collaborators: {project.users.length}
                </p>
              </motion.div>
            ))}
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[rgb(4,31,28,0.5)] bg-opacity-40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#162b29] p-6 rounded-md shadow-md w-96"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Add New Project
              </h3>
              <form onSubmit={createProject}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#054640] text-white rounded-md mb-4"
                  placeholder="Enter project name"
                />
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-[#25d366] py-2 rounded-md text-[black] active:scale-95 font-semibold "
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer w-full mt-2 bg-[#aaaaaa] py-2 rounded-md text-black active:scale-95 font-semibold"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Dashboard;
