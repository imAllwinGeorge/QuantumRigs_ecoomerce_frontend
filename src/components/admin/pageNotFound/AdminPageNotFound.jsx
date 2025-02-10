import React from 'react'

const AdminPageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <h2 className="text-3xl mb-4">Page Not Found</h2>
    <p className="text-lg mb-8">The page you are looking for doesn't exist or has been moved.</p>
    <a
      href="/adminhome"
      className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
    >
      Go Home
    </a>
  </div>
  )
}

export default AdminPageNotFound