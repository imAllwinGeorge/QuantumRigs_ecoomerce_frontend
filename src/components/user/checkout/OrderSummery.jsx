import React from 'react'
import { useSelector } from 'react-redux'

const OrderSummery = () => {
    const details = useSelector(state=>state.user);
    console.log(details)
  return (
    <div>
        OrederSummery
    </div>
  )
}

export default OrderSummery