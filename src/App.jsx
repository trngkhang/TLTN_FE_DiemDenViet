import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserByToken } from "./utils/auth";
import { setUser } from "./redux/slice/userSlice";
import Destination from "./pages/destination";
import DestinationDetail from "./pages/DestinationDetail";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const userFromToken = await getUserByToken();
      dispatch(setUser(userFromToken));
    };

    fetchUser();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="h-16 w-full"></div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
