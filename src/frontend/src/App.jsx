import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home";
import Payment from "./Payment";
import Login from "./Login";
import PostProduct from "./PostProduct";
import Productdisplay from "./Productdisplay";
import AdminDashboardPage from "./AdminDashboardPage";
import SalesOverTimeChart from "./SalesOverTime";
import ChatRoom from "./ChatBox";
import MyChats from "./MyChats";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./FetchUser";
import { socket } from "./utility/socket";
import ViewProducts from "./ViewProducts";
import UserProfile from "./UserProfile";

function App() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    console.log("Joining notification room:", `user_${user._id}`);

    socket.emit("join_room", `user_${user._id}`);
  }, [user]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await axios.get("/api/v1/users/currentuser", {
          withCredentials: true,
        });

        console.log("Current user:", res.data.data);
        setUser(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null);
          return;
        }

        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/buy/:productId" element={<Payment />} />
      <Route path="/searchforproduct" element={<Productdisplay />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sell" element={<PostProduct />} />
      <Route path="/displayproduct" element={<Productdisplay />} />
      <Route path="/admindashboard" element={<AdminDashboardPage />} />
      <Route path="/getsales" element={<SalesOverTimeChart />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
      <Route path="/displaychats" element={<MyChats />} />
      <Route path="/displayallproduct" element={<ViewProducts />} />
      <Route path="/viewprofile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;