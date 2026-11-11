import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { doctors, assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/Relateddoctor";
import { AppContext } from "../context/AppContext";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currency = "$";

const Appointment = () => {
  // Hooks must live INSIDE the component
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const { docId } = useParams();
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Find the doctor from the URL id
  useEffect(() => {
    setDocInfo(doctors.find((doc) => doc._id === docId) || null);
  }, [docId]);

  // Build 30-minute slots (10:00 AM – 9:00 PM) for the next 7 days
  useEffect(() => {
    if (!docInfo) return;

    const allSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        // Today: start from the next half hour, but not before 10 AM
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const daySlots = [];
      while (currentDate < endTime) {
        daySlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (daySlots.length > 0) allSlots.push(daySlots);
    }

    setDocSlots(allSlots);
    setSlotIndex(0);
    setSlotTime("");
  }, [docInfo]);

  // Single booking function (replaces bookAppointment + handleBooking)
  const bookAppointment = async () => {
    if (!token) {
      toast.error("Please login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.error("Please select a time slot");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!docInfo) {
    return <p className="text-center text-gray-500 py-20">Doctor not found.</p>;
  }

  return (
    <div>
      {/* ---------- Doctor Details ---------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-[#5F6FFF] w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>

          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <span className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </span>
          </div>

          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-175 mt-1">
              {docInfo.about}
            </p>
          </div>

          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currency}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ---------- Booking Slots ---------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>

        {/* Days */}
        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
          {docSlots.map((daySlots, index) => (
            <div
              key={index}
              onClick={() => {
                setSlotIndex(index);
                setSlotTime("");
              }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${
                slotIndex === index
                  ? "bg-[#5F6FFF] text-white"
                  : "border border-gray-200 hover:border-[#5F6FFF]"
              }`}
            >
              <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
              <p>{daySlots[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="flex items-center gap-3 w-full overflow-x-auto mt-4 pb-2">
          {docSlots[slotIndex]?.map((slot) => (
            <p
              key={slot.time}
              onClick={() => setSlotTime(slot.time)}
              className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${
                slot.time === slotTime
                  ? "bg-[#5F6FFF] text-white"
                  : "text-gray-500 border border-gray-300 hover:border-[#5F6FFF]"
              }`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-[#5F6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-[#4B5BE6] active:scale-95 transition-all"
        >
          Book an appointment
        </button>
      </div>

      {/* ---------- Related Doctors ---------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
