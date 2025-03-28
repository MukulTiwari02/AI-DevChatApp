import React from "react";

const FileTreeElement = ({ fileName, setCurrentFile, setOpenFiles }) => {
  return (
    <div
      onClick={() => {
        setCurrentFile(fileName);
        setOpenFiles(openFiles => [...new Set([...openFiles, fileName])]);
      }}
      className="cursor-pointer hover:bg-[#ece5dd] hover:scale-105 tree-element px-4 p-3 flex items-center bg-[#25d366] w-full"
    >
      <p className="font-semibold text-xl">{fileName}</p>
    </div>
  );
};

export default FileTreeElement;
