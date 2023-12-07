import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { 
  RegisterAdmin, 
  LoginAdmin,
  UserOptions,
  AdminDashboard,
  Homepage, 
} from './screens/index';
import './App.css'

function App() {

  const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  const [loading, setLoading] = useState(false);

  console.log('currentRole in app: ', currentRole);

  useEffect(() => {
    // Check if currentRole is not undefined (meaning user info is available)
    if (currentRole !== undefined) {
      // Store currentRole in localStorage
      localStorage.setItem('currentRole', currentRole);
      setLoading(false);
    }
  }, [currentRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {currentRole == null && (
          <>
          <Route path="/" element={<Homepage />} />
          <Route path="/select-user" element={<UserOptions visitor="normal" />} />
          <Route path="/select-guest" element={<UserOptions visitor="guest" />} />
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin-register" element={<RegisterAdmin />} />

          <Route path="/admin-login" element={<LoginAdmin role="Admin" />} />
          <Route path='/teacher-login' element={<LoginAdmin role="Teacher" />} />
          <Route path='/student-login' element={<LoginAdmin role="Student" />} />
          <Route path='/user-login' element={<LoginAdmin role="User" />} />
          {/* <Route path="/admin-login" element={<LoginAdmin />} /> */}
          <Route path='*' element={<Navigate to='/' />} />
        </>
      )}

      {currentRole == 'Admin' && (
        <>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin-login" element={<LoginAdmin />} /> */}
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> */}
          {/* <Route path="*" element={<Navigate to />} /> */}
        </>
      )}

      {currentRole == 'Student' && (
        <>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </>
      )}

      {currentRole == 'Teacher' && (
        <>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </>
      )}

      {currentRole == 'User' && (
        <>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </>
      )}
      </Routes>
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
