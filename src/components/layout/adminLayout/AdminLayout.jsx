import React from 'react'
import AdminNav from '../adminComponents/adminNav'
import AdminSide from '../adminComponents/AdminSide'
import './AdminLayout.css'

const AdminLayout = ({children}) => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <AdminNav/>
      </header>
      <div className="admin-content">
        <aside className="admin-sidebar">
          <AdminSide/>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout

