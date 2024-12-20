import { googleLogout } from '@react-oauth/google'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const Navigate = useNavigate();
  const handleClick = ()=>{
    googleLogout();
    Navigate('/login')
  }
  return (
    <div>
      <button onClick={handleClick} >logout</button>
    </div>
  )
}

export default Home