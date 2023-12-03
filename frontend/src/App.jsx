import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { RegisterAdmin, AdminDashboard } from './screens/index';
import './App.css'

function App() {

  const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  const [loading, setLoading] = useState(false);

  console.log('currentRole in app: ', currentRole);

  useEffect(() => {
    // Check if currentRole is not undefined (meaning user info is available)
    if (currentRole !== undefined) {
      setLoading(false);
    }
  }, [currentRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {currentRole == null &&
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin-register" element={<RegisterAdmin />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      }

      {currentRole == 'Admin' && 
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> */}
          {/* <Route path="*" element={<Navigate to />} /> */}
        </Routes>
      }

      {currentRole == 'Student' &&
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      }

      {currentRole == 'Teacher' &&
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      }

      {currentRole == 'User' &&
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      }
    </Router>
  )

  // return (
  //   <div>
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<Home />} />
  //         <Route path="/about" element={<About />} />
  //         <Route path="/contact" element={<Contact />} />
  //       </Routes>
  //     </Router>
  //   </div>
  // )
}

export default App
