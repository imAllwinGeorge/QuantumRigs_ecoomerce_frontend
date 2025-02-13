// import React from "react";
// import Footer from "../footer";
// import Navbar from "../navbar";

// // import './UserLayout.css'

// const UserLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen bg-white text-white">
//       <header className="sticky top-0 z-50 bg-white border-b border-[#9b9696] py-4 w-full">
//         <Navbar />
//       </header>
      
//       <main className="flex-1 w-full max-w-[1600px] mx-auto px-1 py-8 min-h-[80vh]">
//         {children}
//       </main>
//       <footer className="bg-[#111] border-t border-[#333] py-8 w-full">
//         <Footer />
//       </footer>

//       <style jsx global>{`
//         .container {
//           width: 100%;
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 0 1rem;
//         }

//         .grid-container {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 1.5rem;
//           margin: 2rem 0;
//         }

//         @media (max-width: 1200px) {
//           .grid-container {
//             grid-template-columns: repeat(3, 1fr);
//           }
//         }

//         @media (max-width: 992px) {
//           .grid-container {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         @media (max-width: 576px) {
//           .grid-container {
//             grid-template-columns: 1fr;
//           }
//         }

//         .bg-gradient {
//           background: linear-gradient(to right, #1a472a, #000);
//         }

//         .text-accent {
//           color: #4ade80;
//         }

//         .page-transition {
//           animation: fadeIn 0.3s ease-in-out;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         ::-webkit-scrollbar {
//           width: 8px;
//         }

//         ::-webkit-scrollbar-track {
//           background: #111;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: #333;
//           border-radius: 4px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: #444;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserLayout;
import React, { useState } from "react";
import Footer from "../footer";
import Navbar from "../navbar";
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
