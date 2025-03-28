import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../config/axios";
import CollaborationUser from "../components/CollaborationUser.jsx";
import FileTreeElement from "../components/FileTreeElement.jsx";
import MemberUser from "../components/MemberUser.jsx";
import * as socket from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import GridLoader from "react-spinners/GridLoader";

function SyntaxHighlightedCode(props) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const { user, setUser } = useContext(UserContext);
  const [myMessage, setMyMessage] = useState("");
  const [project, setProject] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const params = useParams();

  useEffect(() => {
    if (!user) {
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
    }
  }, []);

  useEffect(() => {
    socket.initializeSocket(params.id);

    socket.receiveMessage("project-message", (data) => {
      if (data.sender._id === "AI") {
        setWaitingForResponse(false);
        try {
          const message = JSON.parse(data.message);
          if (message.fileTree) {
            setFileTree(message.fileTree);
            saveFileTree(message.fileTree);
            setOpenFiles([]);
            setCurrentFile(null);
          }
        } catch (error) {
          console.log(error);
          data.message = JSON.stringify({
            text: "Unknown response format. Try again with a more detailed prompt giving details about the file structure too if possible.",
          });
        }
      }
      appendIncomingMessage(data);
    });
    axios
      .get(`/project/getProject/${params.id}`)
      .then((res) => {
        setProject(res.data);
        setFileTree(res.data.fileTree);
      })
      .catch((err) => console.error(err));
  }, []);

  const appendIncomingMessage = (messageObject) => {
    setMessages((prevMessages) => [
      {
        type: "incoming",
        message: messageObject.message,
        sender: messageObject.sender,
      },
      ...prevMessages,
    ]);
  };

  const appendOutgoingMessage = (messageObject) => {
    setMessages((prevMessages) => [
      {
        type: "outgoing",
        message: messageObject.message,
        sender: messageObject.sender,
      },
      ...prevMessages,
    ]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (myMessage === "") return;
    const message = myMessage.replace(/\n/g, "<br />");
    if (message.toLowerCase().includes("@ai")) setWaitingForResponse(true);

    socket.sendMessage("project-message", {
      message: message,
      sender: user,
    });

    appendOutgoingMessage({
      message: message,
      sender: user,
    });

    setMyMessage("");
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/users/getAllUsers");
      const users = response.data;
      const usersNotInProject = users.filter(
        (user) => !project.users.includes(user._id)
      );
      setAllUsers(usersNotInProject);
    } catch (error) {
      console.error(error);
    }
  };

  const addUsersToProject = async () => {
    try {
      const updatedProject = await axios.put("/project/addUser", {
        projectId: project._id,
        users: selectedUsers,
      });
      setProject(updatedProject.data);
      setSelectedUsers([]);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) sendMessage(e);

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();

      const cursorPosition = e.target.selectionStart;
      const newText =
        myMessage.slice(0, cursorPosition) +
        "\n" +
        myMessage.slice(cursorPosition);
      setMyMessage(newText);

      e.target.scrollTop = e.target.scrollHeight;

      e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
    }
  };

  const renderAiMessageTextToChat = (message) => {
    const messageObject = JSON.parse(message);
    return (
      <Markdown
        children={messageObject.text}
        options={{
          overrides: {
            code: SyntaxHighlightedCode,
          },
        }}
      />
    );
  };

  const saveFileTree = async (ft) => {
    try {
      const updatedProject = await axios.put("/project/update-fileTree", {
        projectId: params.id,
        fileTree: ft,
      });
      setProject(updatedProject.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left h-full flex-col flex min-w-100 w-[30%] bg-[#075e54] relative">
        <header className="flex justify-between items-center p-4 w-full bg-[#128c7e] shadow-xl top-0 absolute z-10">
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

        <div className="conversation-area flex flex-grow flex-col absolute top-0 pt-23 pb-16 h-full w-full">
          <div className="message-box h-full flex-grow flex overflow-y-auto scroll-smooth flex-col-reverse px-4 py-4 gap-4">
            {waitingForResponse && (
              <div className="max-w-100 bg-[#054640] text-[#ece5dd] px-3 py-2 rounded-lg">
                <small className="opacity-70">AI</small>
                <p className="text-base mt-2">
                  <GridLoader color="#ece5dd" size={6} />
                </p>
              </div>
            )}
            {messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={
                    message.type === "incoming"
                      ? message.sender._id === "AI"
                        ? "max-w-100 bg-[#054640] text-[#ece5dd] px-3 py-2 rounded-lg"
                        : "max-w-80 flex flex-col w-fit text-wrap break-words bg-[#c4c1c1] px-3 py-2 rounded-lg"
                      : "max-w-80 flex flex-col w-fit text-wrap break-words bg-[#dcf8c6] px-3 py-2 rounded-lg ml-auto"
                  }
                >
                  <small className="opacity-70">{message.sender.email}</small>
                  <p className="text-base">
                    {message.type === "incoming" &&
                    message.sender._id === "AI" ? (
                      renderAiMessageTextToChat(message.message)
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: message.message
                            .replace(/^\s*<br\s*\/?>\s*/g, "") // Remove <br> tags from the start
                            .replace(/\s*<br\s*\/?>\s*$/g, "") // Remove <br> tags from the end
                            .replace(/(<br\s*\/?>\s*)+/g, "<br />") // Collapse multiple <br> tags into one
                            .trim(), // Trim leading/trailing spaces
                        }}
                      />
                    )}
                  </p>
                </div>
              );
            })}
          </div>
          <form
            onSubmit={sendMessage}
            className="input-box absolute bottom-0 w-full flex gap-2 justify-center items-center mb-3 px-4 h-12"
          >
            <textarea
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="py-3 px-4 h-full flex items-center justify-center flex-10/12 bg-[#ece5dd] outline-0 border-0 rounded-lg resize-none"
              placeholder="Use @ai to give prompt to AI."
            />
            <button
              type="submit"
              className="bg-[#25D366] py-3 px-3 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 active:scale-90 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#ece5dd"
                className="size-7 translate-x-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>

        <div
          className={
            "side-panel overflow-hidden flex w-full flex-col h-full z-20 absolute top-0 duration-700 transition-all ease-in-out " +
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
            {project?.users.length > 0 &&
              project.users.map((userId) => (
                <MemberUser key={userId} userId={userId} />
              ))}
          </div>
        </div>
      </section>

      <section className="right flex flex-grow h-full">
        <div className="explorer h-full bg-[#054640] min-w-56 w-2/12">
          <div className="file-tree flex flex-col overflow-hidden">
            {Object.keys(fileTree).map((fileName) => {
              return (
                <FileTreeElement
                  key={fileName}
                  fileName={fileName}
                  setCurrentFile={setCurrentFile}
                  setOpenFiles={setOpenFiles}
                />
              );
            })}
          </div>
        </div>
        <div className="code-editor flex flex-col flex-grow h-full bg-[#0b2926]">
          <div className="top flex justify-between w-full">
            <div className="files flex">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  className={`open-file cursor-pointer transition-all p-3 px-4 flex justify-center items-center w-fit gap-2 ${
                    currentFile === file
                      ? "scale-105 ml-0.5 bg-[#c2fcf3]"
                      : " bg-[#128c7e]"
                  }`}
                >
                  <p
                    onClick={() => setCurrentFile(file)}
                    className="font-semibold text-lg w-full h-full"
                  >
                    {file}
                  </p>
                  {currentFile === file && (
                    <span
                      onClick={() => {
                        const updatedFiles = [...openFiles];
                        const indexOfFile = updatedFiles.indexOf(file);
                        if (indexOfFile == 0 && openFiles.length == 1)
                          setCurrentFile(null);
                        else if (indexOfFile == 0) setCurrentFile(openFiles[1]);
                        else setCurrentFile(openFiles[indexOfFile - 1]);
                        updatedFiles.splice(indexOfFile, 1);
                        setOpenFiles(updatedFiles);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
            {currentFile && fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed z-20 inset-0 overflow-y-hidden">
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
