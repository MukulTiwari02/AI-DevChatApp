import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [projectName, setProjectName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectAdded, setProjectAdded] = useState(0);

  async function createProject(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/project/create", {
        name: projectName,
      });
      setIsModalOpen(false);
      setProjectName("");
      setProjectAdded((e) => e + 1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`/users/profile`);
        if (!response) navigate("/register");
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
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

  const loginUser = () => {
    navigate("/login");
  };

  return (
    <main className="p-8 h-[100vh] w-[100vw] bg-neutral-200">
      {!user && (
        <button
          onClick={loginUser}
          className="text-md flex justify-center h-10 w-fit items-center bg-blue-500 px-3 py-1 cursor-pointer hover:bg-blue-600 text-white rounded-md"
        >
          Login to start developing
        </button>
      )}
      {user && (
        <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
          Logged in user : <span className="font-normal">{user?.email}</span>{" "}
          <button
            onClick={logoutUser}
            className="text-sm flex justify-center items-center bg-red-400 px-3 py-1 cursor-pointer hover:bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </h1>
      )}
      {user && (
        <div className="flex gap-8 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 cursor-pointer border text-white bg-blue-500 hover:bg-white hover:text-blue-500 hover:scale-105 transition-all border-slate-300 rounded-md py-2 px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Project
          </button>

          {projects.length > 0 &&
            projects.map((project) => (
              <div
                onClick={() => navigate(`/project/${project._id}`)}
                key={project._id}
                className="py-2 px-6 border border-gray-400 rounded-md cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all bg-neutral-200 font-bold"
              >
                <p>
                  {project.name[0].toUpperCase() + project.name.substring(1)}
                </p>
                <div className="w-full flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  {project.users.length}
                </div>
              </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-neutral-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-88 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-neutral-300 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Project
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-300 px-4 py-3 sm:px-6">
                <form onSubmit={createProject}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="flex-1 block w-full border px-3 bg-white border-gray-400 rounded-md shadow-sm sm:text-sm"
                      placeholder="Enter project Name"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
              <div className="mb-6 mx-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setProjectName("");
                  }}
                  className="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
