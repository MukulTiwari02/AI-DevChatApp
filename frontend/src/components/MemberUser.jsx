import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { IoExitOutline } from "react-icons/io5";

const MemberUser = ({ userId, isCurrentUser, removeUserFromProject }) => {
  const innerWidth = window.innerWidth;
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, []);

  return user ? (
    <div className="user flex gap-2 items-center px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#06625f"
        className="size-13 sm:size-15"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          clipRule="evenodd"
        />
      </svg>
      <p className="font-semibold text-lg sm:text-xl">{user?.email}</p>
      {isCurrentUser && (
        <button
          className="ml-auto sm:h-8 sm:w-8 cursor-pointer active:scale-95"
          onClick={() => removeUserFromProject()}
          title="Leave Project"
        >
          <IoExitOutline size={innerWidth > 600? 30 : 20} />
        </button>
      )}
    </div>
  ) : (
    <></>
  );
};

export default MemberUser;
