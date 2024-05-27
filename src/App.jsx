import { Suspense, lazy, useEffect } from 'react'
import './assets/style/style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute';
import Loaders from './components/layout/Loaders';
import axios from 'axios';
import { server } from './constants/config';
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast';
import { userExists, userNotExists } from './redux/reducers/auth';
import { SocketProvider } from './socket';
import './assets/style/style.css'
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"))
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagemant = lazy(() => import("./pages/admin/ChatManagemant"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

let user = true;

const App = () => {

  const { user, loader } = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) =>
        dispatch(userExists(data?.user))

      )
      .catch((err) =>
        dispatch(userNotExists())
      );
  }, [dispatch]);

  return loader ? (<Loaders />) : (
    <Router>
      <Suspense fallback={<Loaders />}>
        <Routes>
          <Route element={<SocketProvider><ProtectRoute user={user} /></SocketProvider>} >
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>

          <Route path='/login' element={<ProtectRoute user={!user} redirect='/'><Login /></ProtectRoute>} />

          {/* <Route path='/register' element={
            <ProtectRoute user={!user} redirect='/'>
              <Register />
            </ProtectRoute>

          } /> */}

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          {/* <Route path='/admin/chats' element={<ChatManagemant />} /> */}
          <Route path='/admin/messages' element={<MessageManagement />} />
          <Route path='*' element={<NotFound />} />

        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  )
}

export default App