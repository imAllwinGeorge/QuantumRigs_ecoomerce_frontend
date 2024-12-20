import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../api/Axios';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/admin/users');
                console.log(response.data)
                if(response.data){
                    setUsers(response.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserData();
    }, [])

    const blockUser = async (userId) => {
        const response = await axiosInstance.patch('/admin/blockuser', {userId})
        console.log(response.data); // Log backend response
        if (response.status === 200) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: true } : user
                )
            );
        }
    }

    const unBlockUser = async (userId) => {
        const response = await axiosInstance.patch('/admin/unblockuser', {userId})
        console.log(response.data); // Log backend response
        if (response.status === 200) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: false } : user
                )
            );
        }
    }

    return (
        <div className="users-container">
            <h1 className="users-title">User Details</h1>
            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.firstName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>
                                    <button
                                        className={`action-btn ${user.isBlocked ? 'unblock-btn' : 'block-btn'}`}
                                        onClick={() => {
                                            console.log(user.isBlocked)
                                            if (user.isBlocked) {
                                                unBlockUser(user._id);
                                            } else {
                                                blockUser(user._id);
                                            }
                                        }}
                                    >
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users

