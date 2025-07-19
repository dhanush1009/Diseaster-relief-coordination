import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)

      const { token, role } = res.data 
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      alert('Login successful')

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'victim') {
        navigate('/request-help')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      console.error(err.response?.data)
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
