import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home"; 
import Payment from "./Payment";
import SearchForm from "./Productdisplay";
import Login from "./Login";
import PostProduct from "./PostProduct";
import Productdisplay from "./Productdisplay";
import AdminDashboardPage from "./adminDashboardPage";
import SalesOverTimeChart from "./SalesOverTime"
import ChatRoom from "./ChatBox";
import MyChats from "./MyChats";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/buy/:productId" element={<Payment/>} />
      <Route path="/searchforproduct" element={<SearchForm/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/sell" element={<PostProduct/>} />
      <Route path="/displayproduct" element={<Productdisplay/>} />
      <Route path="/admindashboard" element={<AdminDashboardPage/>} />
      <Route path="/getsales" element={<SalesOverTimeChart/>} />
     <Route path="/chat/:roomId" element={<ChatRoom />} />
      <Route path="/displaychats" element={<MyChats />} />


 
    </Routes>
  );
}

export default App;
