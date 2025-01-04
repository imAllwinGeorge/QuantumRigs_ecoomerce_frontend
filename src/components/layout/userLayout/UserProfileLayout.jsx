import React from 'react'
import UserProfileSideBar from '../../user/Profile/profileSideBar/UserProfileSideBar'

const UserProfileLayout = ({children}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <UserProfileSideBar />
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default UserProfileLayout