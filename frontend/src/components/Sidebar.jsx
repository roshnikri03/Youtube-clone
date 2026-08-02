import React from 'react'
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside>
        <div className="sidebar-section">
            <NavLink to="/dashboard" className="sidebar-link">
            <span className="link-text">link</span>
            </NavLink>
        </div>
    </aside>
  )
}

export default Sidebar