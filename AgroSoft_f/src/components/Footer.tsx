import React from "react";

interface FooterProps {
  isSidebarOpen: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isSidebarOpen }) => {
  return (
    <footer className="bg-sena-green border-t border-gray-200 p-4 w-full text-white">
      <div
        className={`mx-auto flex justify-between items-center 
          ${isSidebarOpen ? "max-w-[calc(100%-14rem)]" : "max-w-full"}
          px-4 md:px-6 lg:px-8`}
      >
        <p className="text-sm">© {new Date().getFullYear()} Agrosoft - SENA</p>
      </div>
    </footer>
  );
};
