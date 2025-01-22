import React from "react";
import { Link } from "react-router-dom";

const UserProfileSideBar = () => {
  return (
    <div className="h-screen bg-white rounded-lg shadow-sm p-6">
      <ul className="space-y-4">
        <li>
          <Link
            to="/user-profile"
            className="flex items-center text-gray-700 border-b-2 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-bold">User Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/change-password"
            className="flex items-center text-gray-700 border-b-2 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-bold">Change Password</span>
          </Link>
        </li>
        <li>
          <Link
            to="/address-management"
            className="flex items-center text-gray-700 border-b-2 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-bold">Manage Addresses</span>
          </Link>
        </li>
        <li>
          <Link
            to="/my-orders"
            className="flex items-center text-gray-700 border-b-2 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-bold">My Orders</span>
          </Link>
        </li>
        <li>
          <Link
            to="/wallet"
            className="flex items-center text-gray-700 border-b-2 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-bold">Wallet</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserProfileSideBar;
