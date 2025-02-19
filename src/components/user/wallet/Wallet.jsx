import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/Axios';
import { useSelector } from 'react-redux';
import AddMoney from './AddMoney';

const Wallet = () => {
    const user = useSelector(state => state.user.users)
    const [transactionHistory,setTransactionHistory] = useState([])
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [triggerFetch, setTriggerFetch] = useState(false)

    const [credit,debit] = transactionHistory.reduce(([cred,deb],curr)=>{
        curr.type === 'credit'?
        cred += curr.amount:
        deb -= curr.amount
        return [cred,deb]
    },[0,0])
    console.log(credit,debit)

    useEffect(()=>{
        const fetchWalletHistory = async()=>{
            try {
                const response = await axiosInstance.get(`/get-wallet/${user.id}`)
                if(response.status === 200){
                    console.log(response.data.walletTransaction)
                    setTransactionHistory(response?.data?.walletTransaction)
                }
            } catch (error) {
                console.log('fetch wallet history',error);
                toast(error.response.data)
            }
        }
        fetchWalletHistory();
    },[triggerFetch])
  return (

    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {showAddMoney && (
        <div>
          <AddMoney user={user} onClose={()=>{setShowAddMoney(false)
          setTriggerFetch(state=>!state)
        }} />
        </div>
      )}
      <div className='pb-5 '>
        <button className='bg-green-500 px-3 py-2 rounded-lg font-bold ' onClick={()=>setShowAddMoney(true)} >Add money</button>
      </div>
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-gray-600 text-lg mb-2">Available balance</h2>
        <h1 className="text-4xl font-bold text-gray-900">₹{credit + debit}</h1>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-gray-600 text-lg mb-2">Credited Amount</h2>
          <h1 className="text-4xl font-bold text-green-600">₹{credit}</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-gray-600 text-lg mb-2">Debited Amount</h2>
          <h1 className="text-4xl font-bold text-red-600">₹{debit}</h1>
        </div>
      </div>

      <div>
        <h2 className="bg-blue-50 text-gray-900 text-lg font-semibold p-4 rounded-t-lg">History</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-b-lg">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Index</th>
                <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory &&
                transactionHistory.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-700">{transaction.date.split("T")[0]}</td>
                    <td className="p-4 text-gray-700 capitalize">{transaction.type}</td>
                    <td className="p-4 text-gray-700">₹{transaction.amount.toLocaleString()}</td>
                    <td className="p-4 text-gray-700">{transaction.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Wallet