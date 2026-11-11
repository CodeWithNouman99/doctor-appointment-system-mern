import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userdata, setuserData] = useState(false);

  // Get doctors data from backend
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/doctorList");

      if (data.success) {
        setDoctor(data.doctor);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Load user profile data
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", {
        headers: { token },
      });

      if (data.success) {
        setuserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to load profile");
    }
  };

  // Fetch doctors when backendUrl is available
  useEffect(() => {
    if (backendUrl) {
      getDoctorsData();
    }
  }, [backendUrl]);

  // Load profile when token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setuserData(false);
    }
  }, [backendUrl, token]);

  const value = {
    doctors, // static assets data
    doctor, // backend data
    getDoctorsData,
    getdoctorsData: getDoctorsData, // old name kept so existing files don't break
    backendUrl,
    token,
    setToken,
    userdata,
    userData: userdata,
    setuserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
