import React from 'react'
import Footer from '../footer'
import Navbar from '../navbar'
import './UserLayout.css'

const UserLayout = ({children}) => {
  return (
    <div className="user-layout">
      <header className="user-header">
        <Navbar/>
      </header>
      <main className='user-main' >{children}</main>
      <footer className="user-footer">
        <Footer/>
      </footer>
    </div>
  )
}

export default UserLayout