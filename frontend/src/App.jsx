import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { 
  RegisterAdmin, 
  LoginAdmin,
  LoginStudent,
  LoginTeacher,
  UserOptions,
  AdminDashboard,
  Homepage,
  StudentDashboard,
} from './screens/index';
import './App.css'

function App() {

  const currentUser = useSelector(state => state.user.currentUser);
  // const currentRole = useSelector(state => state.user.currentUser?.admin?.role);
  // let currentRole = useSelector(state => state.user.currentUser?.admin?.role) || useSelector(state => state.user.currentUser?.student?.role) || useSelector(state => state.user.currentUser?.teacher?.role) || useSelector(state => state.user.currentUser?.user?.role);
  let currentRole = null;

  if (currentUser) {
    if (currentUser.admin) {
      currentRole = currentUser.admin.role;
    } else if (currentUser.student) {
      currentRole = currentUser.student.role;
    } else if (currentUser.teacher) {
      currentRole = currentUser.teacher.role;
    } else if (currentUser.user) {
      currentRole = currentUser.user.role;
    }
  }

  // let currentRole = null;

  // // // Defining possible roles
  // const possibleRoles = ['Admin', 'Student', 'Teacher', 'User'];

  // // Iterate through possible roles and check if currentRole is one of them
  // // If it is, set the currentRole to that role
  // for (let i = 0; i < possibleRoles.length; i++) {
  //   if (currentUser?.[possibleRoles[i]]?.role) {
  //     currentRole = possibleRoles[i];
  //     break;
  //   }
  // }
  // const [ loading, setLoading ] = useState(true);

  console.log('currentRole in app: ', currentRole);

  useEffect(() => {
    // Check if currentRole is not undefined (meaning user info is available)
    if (currentRole) {
      console.log('Setting currentRole in localStorage:', currentRole);
      // Store currentRole in localStorage
      localStorage.setItem('currentRole', currentRole);
      // setLoading(false);
    }
  }, [currentRole]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (  
    <Router>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme='colored'
      />
      <Routes>
        {currentRole == null && (
          <>
          <Route path="/" element={<Homepage />} />
          <Route path="/select-user" element={<UserOptions visitor="normal" />} />
          <Route path="/select-guest" element={<UserOptions visitor="guest" />} />
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin-register" element={<RegisterAdmin />} />

          <Route path="/admin-login" element={<LoginAdmin role="Admin" />} />
          <Route path='/teacher-login' element={<LoginTeacher role="Teacher" />} />
          <Route path='/student-login' element={<LoginStudent role="Student" />} />
          <Route path='/user-login' element={<LoginAdmin role="User" />} />
          {/* <Route path="/admin-login" element={<LoginAdmin />} /> */}
          <Route path='*' element={<Navigate to='/' />} />
        </>
      )}

      {currentRole == 'Admin' && (
        <>
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          {/* <Route path="/admin-login" element={<LoginAdmin />} /> */}
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> */}
          {/* <Route path="*" element={<Navigate to />} /> */}
        </>
      )}

      {currentRole == 'Student' && (
        <>
          <Route path="/student-dashboard/*" element={<StudentDashboard />} />
          {/* <Route path="/about" element={<About />} />
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
