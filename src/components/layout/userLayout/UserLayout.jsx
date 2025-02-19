
import React, { useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBot from "../ChatBot/ChatBot";

const UserLayout = ({ children }) => {
  const [showChatBot, setShowChatBot] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-white text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-300 py-4 w-full">
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8 min-h-[80vh]">
        {children}
      </main>

      {/* Chat Bot */}
      <div className="fixed bottom-4 right-4 z-50">
        {!showChatBot && (
          <button
            onClick={() => setShowChatBot(true)}
            className="bg-[#4ade80] hover:bg-green-500 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Ask Help From Eva
          </button>
        )}
        {showChatBot && (
          <div className="w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
            <ChatBot onClose={() => setShowChatBot(false)} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;
