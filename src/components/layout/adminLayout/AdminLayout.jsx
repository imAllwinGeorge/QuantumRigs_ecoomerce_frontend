import React from 'react'
import AdminNav from '../adminComponents/adminNav'
import AdminSide from '../adminComponents/AdminSide'


const AdminLayout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#111] text-white">
    {/* Header - Sticky */}
    <header className="sticky top-0 z-50 bg-[#111] px-4 py-4 shadow-md">
      <AdminNav />
    </header>

    {/* Content Area */}
    <div className="flex flex-1 md:flex-row flex-col">
      {/* Sidebar - Sticky */}
      <aside className="md:sticky top-[73px]  md:h-[calc(100vh-73px)] bg-[#242830] shadow-md md:w-64 w-full">
        <div className="h-full ">
          <AdminSide />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
  )
}

export default AdminLayout

