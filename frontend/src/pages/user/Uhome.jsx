import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Form, message } from 'antd'



function uhome() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")

  useEffect(()=>{
    const user = localStorage.getItem('user');

    if(user){
      const userData = JSON.parse(user);
      setUsername(userData.username || 'User');
      setFirstname(userData.firstname || 'User');
      setLastname(userData.lastname || 'User');
    }
  },[])
  return (
    <><br />
    <div className='container'>
      <div className='row justify-content-center'>
        <h2>Welcome, {firstname}</h2>
      </div>
    </div><br /><hr />

    <div className='container'>
      <div className='row'>
        <div className='col-md-14'>
          <div className=''>
            Create Order 
            <Link to={'/ucreate'}><Button size='large' type='primary'>Create</Button></Link>
          </div>
        </div>
      </div>
    </div><br /><hr />
    </>
  )
}

export default uhome