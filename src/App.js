import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import UploadFileComponent from './uploadFile';
import ViewComponent from './View';
import ViewLogComponent from './view_log';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header">
      <h1>Welcome to the File Upload and View Application</h1>
      </header>
        <Routes>
          <Route path="/" element={<UploadFileComponent />} />
          <Route path="/view" element={<ViewComponent />} />
          <Route path="/view_log" element={<ViewLogComponent />} />
        </Routes>
        <Appfooter/>
      </div>
    </Router>
  );
}

function Appfooter() {
  const location = useLocation();
  const [home, setHome] = useState(false);

  useEffect(() => {
    setHome(location.pathname === '/');
  }, [location]);

  return home && (
    <div className='link_to_view'>
      <div className='b_page'>{<Link to="/view">Go to View</Link>}</div>
      <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
    </div>
  );
}

export default App;