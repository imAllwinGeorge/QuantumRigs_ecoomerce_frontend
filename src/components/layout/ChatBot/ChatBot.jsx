// import { Send } from 'lucide-react';
// import React, { useState } from 'react'
// const predefinedQA = [
//     { pattern: /^hello|hi|hey$/i, answer: "Hi there! How can I assist you today?" },
//     { pattern: /^good (morning|evening)$/i, answer: "Good $1! How may I help you?" },
//     { pattern: /store hours|opening hours|business hours/i, answer: "Our store operates from 9 AM to 5 PM, Monday through Friday." },
//     { pattern: /location|address|where are you located/i, answer: "We are located at 123 Main Street, Anytown, USA." },
//     { pattern: /contact info|phone number|email address/i, answer: "You can reach us at (123) 456-7890 or email us at info@example.com." },
//     { pattern: /return policy|returns|refunds/i, answer: "Items can be returned within 30 days of purchase with a receipt." },
//     { pattern: /shipping options|delivery methods/i, answer: "We offer standard, express, and overnight shipping." },
//     { pattern: /payment methods|payment options/i, answer: "We accept credit cards, PayPal, and Apple Pay." },
//     { pattern: /order status|track order/i, answer: "Please provide your order number, and I'll check the status for you." },
//     { pattern: /support|customer service|help/i, answer: "For support, you can call us at (123) 456-7890 or email support@example.com." },
//     { pattern: /services offered|what services do you offer/i, answer: "We offer a range of services including consultations, repairs, and custom orders." },
//     { pattern: /latest news|news|updates/i, answer: "You can find our latest updates and news on our website's 'News' section." },
//     { pattern: /discounts available|current promotions|sales/i, answer: "We currently have a 10% discount on all electronics." },
//     { pattern: /new products|new arrivals|latest products/i, answer: "Check out our 'New Arrivals' section on the website for the latest products." }
//   ];
  
// let chatMessage = []
// const ChatBot = ({onClose}) => {
//     const [message, setMessage] = useState("");
//     const [chatHistory, setHistory] = useState([])

   
//     const handleClick = ()=>{
//         chatMessage.push(message)
//        setHistory(prevState =>[...prevState,message])
//        setMessage("")
//        const userMessage = message.trim();
//        let response = "I'm sorry, I don't have an answer for that.";
     
//        for (const qa of predefinedQA) {
//          const match = userMessage.match(qa.pattern);
//          if (match) {
//            response = qa.answer.replace('$1', match[1] || '');
//            break;
//          }
//        }
     
//        // Display or log the response
//        console.log(response);
//        setHistory(prevState => [...prevState,response])
//     }
//   return (
//     <div className='bg-gray-400 text-white'>
//         <div>
//         <h1>Ask Help From Eva </h1>
//         <img  src="/eva/eva-2339956_960_720.png" alt="bot image" />
//         </div>
//         <div>
//             {chatHistory&&(
//                 chatHistory.map((chat,index)=>(
//                     <h1 key={index} className='text-white'>{chat}</h1>
//                 ))
//             )}
//         </div>
//         <div>
//             <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} />
//             <button onClick={handleClick} ><Send/></button>
//         </div>
//         <button onClick={onClose} className='text-black' >X</button>
//     </div>
//   )
// }

// export default ChatBot


"use client"

import { Send } from "lucide-react"
import { useState } from "react"

const predefinedQA = [
  { pattern: /^hello|hi|hey$/i, answer: "Hi there! How can I assist you today?" },
  { pattern: /^good (morning|evening)$/i, answer: "Good $1! How may I help you?" },
  {
    pattern: /store hours|opening hours|business hours/i,
    answer: "Our store operates from 9 AM to 5 PM, Monday through Friday.",
  },
  { pattern: /location|address|where are you located/i, answer: "We are located at 123 Main Street, Anytown, USA." },
  {
    pattern: /contact info|phone number|email address/i,
    answer: "You can reach us at (123) 456-7890 or email us at info@example.com.",
  },
  {
    pattern: /return policy|returns|refunds/i,
    answer: "Items can be returned within 30 days of purchase with a receipt.",
  },
  { pattern: /shipping options|delivery methods/i, answer: "We offer standard, express, and overnight shipping." },
  { pattern: /payment methods|payment options/i, answer: "We accept credit cards, PayPal, and Apple Pay." },
  {
    pattern: /order status|track order/i,
    answer: "Please provide your order number, and I'll check the status for you.",
  },
  {
    pattern: /support|customer service|help/i,
    answer: "For support, you can call us at (123) 456-7890 or email support@example.com.",
  },
  {
    pattern: /services offered|what services do you offer/i,
    answer: "We offer a range of services including consultations, repairs, and custom orders.",
  },
  {
    pattern: /latest news|news|updates/i,
    answer: "You can find our latest updates and news on our website's 'News' section.",
  },
  {
    pattern: /discounts available|current promotions|sales/i,
    answer: "We currently have a 10% discount on all electronics.",
  },
  {
    pattern: /new products|new arrivals|latest products/i,
    answer: "Check out our 'New Arrivals' section on the website for the latest products.",
  },
]

const chatMessage = []

const ChatBot = ({ onClose }) => {
  const [message, setMessage] = useState("")
  const [chatHistory, setHistory] = useState([])

  const handleClick = () => {
    if (message.trim() === "") return

    chatMessage.push(message)
    setHistory((prevState) => [...prevState, { type: "user", text: message }])
    setMessage("")
    const userMessage = message.trim()
    let response = "I'm sorry, I don't have an answer for that."

    for (const qa of predefinedQA) {
      const match = userMessage.match(qa.pattern)
      if (match) {
        response = qa.answer.replace("$1", match[1] || "")
        break
      }
    }

    setTimeout(() => {
      setHistory((prevState) => [...prevState, { type: "bot", text: response }])
    }, 500)
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 text-gray-800">
      <div className="bg-[#4ade80] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/eva/eva-2339956_960_720.png"
            alt="bot image"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 object-cover"
          />
          <h1 className="text-white font-bold text-lg sm:text-xl">Hi I'm Eva, How may I help you?</h1>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-lg ${
                chat.type === "user" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {chat.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleClick()}
            className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm sm:text-base"
            placeholder="Type your message..."
          />
          <button
            onClick={handleClick}
            className="bg-[#4ade80] text-white rounded-r-full p-2 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <Send size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot

