import React from 'react'

function Header() {
  return (
    <header className="header">
        <div className="header-left">
            <button className="menu-button">
                <span className="menu-icon"></span>
            </button>
            <h1 className="header-title">My App</h1>
        </div>
        <div className="header-right">
            <button className="profile-button">
                <span className="profile-icon"></span>
            </button>
        </div>
    </header>
  )
}

export default Header