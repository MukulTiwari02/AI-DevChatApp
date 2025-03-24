import React, { useEffect, useState } from "react";
import { Router, useParams } from "react-router";
import axios from "../config/axios";
import CollaborationUser from "../components/CollaborationUser.jsx";
import MemberUser from "../components/MemberUser.jsx";

const Project = () => {
  const [myMessage, setMyMessage] = useState("");
  const [project, setProject] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const params = useParams();

  useEffect(() => {
    axios
      .get(`/project/getProject/${params.id}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sendMessage = () => {
    setMyMessage("");
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/users/getAllUsers");
      const users = response.data;
      const usersNotInProject = users.filter(user =>!project.users.includes(user._id));
      setAllUsers(usersNotInProject);

    } catch (error) {
      console.error(error);
    }
  };

  const addUsersToProject = async () => {
      try {
        const updatedProject = await axios.put('/project/addUser', {projectId: project._id, users: selectedUsers});
        setProject(updatedProject.data);
        setSelectedUsers([]);
        setIsModalOpen(false)
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left h-full flex-col flex min-w-100 w-[30%] bg-[#075e54]">
        <header className="flex justify-between items-center p-4 w-full bg-[#128c7e] shadow-xl">
          <h1 className="text-[#ece5dd] text-2xl">
            {project?.name[0].toUpperCase() + project?.name.substring(1)}
          </h1>
          <button
            onClick={toggleSidePanel}
            className="cursor-pointer active:scale-95 transition-all bg-[#ece5dd] p-3 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </button>
        </header>

        <div className="conversation-area flex flex-grow flex-col">
          <div className="message-box flex-grow flex flex-col justify-end px-2 pb-4 gap-4">
            <div className="incomingMessage max-w-80 flex flex-col w-fit bg-[#c4c1c1] px-3 py-2 rounded-lg">
              <small className="opacity-70">test@gmail.com</small>
              <p className="text-base">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="outgoingMessage max-w-80 flex flex-col w-fit bg-[#dcf8c6] px-3 py-2 rounded-lg ml-auto">
              <small className="opacity-70">test@gmail.com</small>
              <p className="text-base">
                Lorem ipsum dolor sit amet.Lorem ipsum dolor sit ametLorem ipsum
                dolor sit amet
              </p>
            </div>
          </div>
          <div className="input-box flex gap-2 justify-center items-center mb-3 px-2 h-12">
            <input
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
              type="text"
              className="py-2 h-full px-4 flex-10/12 bg-[#ece5dd] outline-0 border-0 rounded-lg"
              placeholder="Write your message here"
            />
            <button
              onClick={sendMessage}
              className="bg-[#25D366] py-3 px-3 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 active:scale-90 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ece5dd"
                className="size-8 translate-x-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={
            "side-panel overflow-hidden flex flex-col h-full min-w-100 w-[30%] absolute top-0 duration-700 bg-red-400 transition-all ease-in-out " +
            (!isSidePanelOpen ? "left-[-100%]" : "left-0")
          }
        >
          <header className="flex gap-4 items-center p-4 w-full bg-[#128c7e] shadow-sm shadow-gray-500 z-5">
            <h1 className="text-[#ece5dd] text-2xl">Project Members</h1>
            <button
              title="Add Collaborator"
              onClick={() => {
                setIsModalOpen(true);
                fetchAllUsers();
              }}
              className="cursor-pointer active:scale-95 transition-all h-fit w-fit p-2 bg-[#ece5dd] rounded-full flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6  translate-x-[1.5px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            </button>
            <button
              onClick={toggleSidePanel}
              className="ml-auto cursor-pointer active:scale-95 transition-all h-15 w-15 bg-[#ece5dd] rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
          <div className="users flex-grow overflow-y-scroll scroll-smooth flex flex-col gap-2 pt-4 bg-[#c4c1c1]">
            {project?.users.length > 0 && project.users.map(userId => <MemberUser key={userId} userId={userId}/>)}
            
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-hidden">
          <div className="flex flex-col items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

            <div className="inline-block align-bottom bg-neutral-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-40 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-neutral-300 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Collaborators to this project
                    </h3>
                  </div>
                </div>
              </div>
              <div className="allUsers overflow-x-hidden min-h-100 max-h-110 flex-grow mb-6 scroll-smooth overflow-y-scroll">
                {allUsers.length > 0 &&
                  allUsers.map((user) => (
                    <CollaborationUser
                      key={user._id}
                      user={user}
                      selectedUsers={selectedUsers}
                      setSelectedUsers={setSelectedUsers}
                    />
                  ))}
              </div>
              <div className="mb-6 mx-6">
                {selectedUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      addUsersToProject();
                    }}
                    className="mb-2 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 bg-green-400 hover:bg-green-500 sm:text-sm"
                  >
                    Add selected Users
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
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

export default Project;
