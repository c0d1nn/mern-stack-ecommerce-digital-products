import React from 'react'
import { Link } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import CartIcon from './CartIcon';

const AdminNavbar = () => {

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = "/";
    }

  return (
        <div className="navbar max-w-[1200px] mx-auto">

        <div className="navbar-center flex">
            <button onClick={logout} className='btn'>Logout</button>
        </div>

        <div className="navbar-end gap-12">
            <ThemeToggleButton/>
        </div>
  
</div>
  )
}

export default AdminNavbar