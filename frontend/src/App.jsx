import React from 'react'
// import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
       {/* <Header toggleSidebar={toggleSidebar} /> */}
        <div className="main-content">
          <Sidebar isOpen={sidebarOpen} />
          </div>
    </div>
  )
}

export default App