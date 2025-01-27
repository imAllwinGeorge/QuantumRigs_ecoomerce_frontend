import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../api/Axios';
import './Users.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Users = () => {
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/admin/users');
                console.log(response.data)
                if(response.data){
                    setUsers(response.data)
                    toast(response.data)
                }
            } catch (error) {
                console.log("fetch users",error);
                toast(error.response.data)
            }
        }
        fetchUserData();
    }, [])

    const blockUser = async (userId) => {
        try {
            const response = await axiosInstance.patch('/admin/blockuser', {userId})
        console.log(response.data); // Log backend response
        if (response.status === 200) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: true } : user
                )
            );
            toast(response.data.message)
        }
        } catch (error) {
            console.log('block users',error.message);
            toast(error.response.data)
        }
    }

    const unBlockUser = async (userId) => {
        try {
            const response = await axiosInstance.patch('/admin/unblockuser', {userId})
        console.log(response.data); // Log backend response
        if (response.status === 200) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: false } : user
                )
            );
            toast(response.data.message)
        }
        } catch (error) {
            console.log('unblock user',error);
            toast(response.data)
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
                                                Swal.fire({
                                                      title: 'Are you sure?',
                                                      text: 'Do you want to change the status?',
                                                      icon: 'warning',
                                                      showCancelButton: true,
                                                      confirmButtonColor: '#3085d6',
                                                      cancelButtonColor: '#d33',
                                                      confirmButtonText: 'Yes, change it!',
                                                      cancelButtonText: 'Cancel'
                                                    }).then((result) => {
                                                      if (result.isConfirmed) {
                                                        unBlockUser(user._id);;
                                                      }
                                                    });
                                                
                                            } else {
                                                Swal.fire({
                                                    title: 'Are you sure?',
                                                    text: 'Do you want to change the status?',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Yes, change it!',
                                                    cancelButtonText: 'Cancel'
                                                  }).then((result) => {
                                                    if (result.isConfirmed) {
                                                      blockUser(user._id);;
                                                    }
                                                  });
                                               
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

