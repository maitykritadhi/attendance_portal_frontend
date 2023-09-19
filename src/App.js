// import logo from './logo.svg';
import './App.css';
// import Button from "react-bootstrap/Button";
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import CourseList from './components/CourseList';
import StudentList from './components/StudentList';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ChooseDay from './components/ChooseDay';
import ChooseCourse from './components/ChooseCourse';
import DisplayStudents from './components/DisplayStudents';
import UChooseDate from './components/UChooseDate';
import UChooseCourse from './components/UChooseCourse';
import UViewStudents from './components/UViewStudents';

import StudentDashboard from './components/StudentDashboard';
import CourseAttendanceDetails from './components/CourseAttendanceDetails';
import StudentEnquiry from './components/StudentEnquiry';
import ProfReceiveEnquiry from './components/ProfReceiveEnquiry';
import StudentEnquiryResult from './components/StudentEnquiryResult';

function App() {
  return (
    <>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:courseId/:courseName" element={<StudentList />} />
            <Route path="/chooseday" element={<ChooseDay />} />
            <Route path="/chooseday/choosecourse" element={<ChooseCourse />} />
            <Route
              path="/chooseday/choosecourse/:courseId/:courseName"
              element={<DisplayStudents />}
            />
            <Route path="/uchoosedate" element={<UChooseDate />} />
            <Route
              path="/uchoosedate/uchoosecourse"
              element={<UChooseCourse />}
            />
            <Route
              path="/uchoosedate/uchoosecourse/:courseId"
              element={<UViewStudents />}
            />
            {/* <Route path="/another-route" element={<AnotherRoute />} /> */}
            <Route path="/login/studentinfo" element={<StudentDashboard />} />
            <Route
              path="/login/studentinfo/:courseId"
              element={<CourseAttendanceDetails />}
            />
            <Route
              path="/login/studentinfo/studentenquiry"
              element={<StudentEnquiry />}
            />
            <Route
              path="/profreceiveenquiry"
              element={<ProfReceiveEnquiry />}
            />
            <Route
              path="/login/studentinfo/studentenquiryresult"
              element={<StudentEnquiryResult />}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
