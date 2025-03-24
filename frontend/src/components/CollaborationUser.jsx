import React, { useState } from "react";

const CollaborationUser = ({user, selectedUsers, setSelectedUsers}) => {

  const [isSelected, setIsSelected] = useState(false);

  let newSelectedUsers = [...new Set(selectedUsers)];

  function toggleCurrentUserSelection(){
    setIsSelected(!isSelected);

    if(newSelectedUsers.indexOf(user._id) === -1)
    {
        newSelectedUsers.push(user._id);
        setSelectedUsers(newSelectedUsers);
    }
    else{
      newSelectedUsers.splice(newSelectedUsers.indexOf(user._id), 1);
      setSelectedUsers(newSelectedUsers);
    }
  }

  return (
    <div 
      onClick={toggleCurrentUserSelection}
    className={"user select-none cursor-pointer p-3 px-6 flex gap-2 items-center " + (isSelected ? "bg-[#25d366] hover:bg-[#b16363a8]" : " hover:bg-gray-400") }>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-10"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          clipRule="evenodd"
        />
      </svg>
      <p className="font-semibold text-md">
        {user.email}
      </p>
    </div>
  );
};

export default CollaborationUser;
