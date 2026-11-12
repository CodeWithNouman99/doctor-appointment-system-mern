import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { doctors, assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const currency = "$";

// "12_11_2026" -> Date
const parseSlotDate = (slotDate) => {
  if (!slotDate) return null;
  const [day, month, year] = slotDate.split("_").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) =>
  date
    ? date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const getStatus = (item) => {
  if (item.cancelled) return "cancelled";
  if (item.isCompleted) return "completed";
  return "upcoming";
};

const statusStyle = {
  upcoming: "text-[#5F6FFF] bg-indigo-50",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-500 bg-red-50",
};

const statusLabel = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

const MyAppointments = () => {
  // Hooks must live INSIDE the component
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments([...data.appointments].reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getAppointments();
    } else {
      navigate("/login");
    }
  }, [token]);

  const handlePay = (id) => {
    console.log("Pay online for appointment:", id);
    // TODO: integrate Stripe / Razorpay payment API here
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: id },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDoctorsData?.();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const stats = [
    { label: "Total", value: appointments.length },
    {
      label: "Upcoming",
      value: appointments.filter((a) => getStatus(a) === "upcoming").length,
    },
    {
      label: "Completed",
      value: appointments.filter((a) => getStatus(a) === "completed").length,
    },
    {
      label: "Cancelled",
      value: appointments.filter((a) => getStatus(a) === "cancelled").length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          My Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all your booked appointments.
        </p>
      </div>

      {/* ---------- Quick Stats ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-indigo-50 rounded-xl py-4 sm:py-5 text-center"
          >
            <p className="text-xl sm:text-2xl font-bold text-[#5F6FFF]">
              {item.value}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* ---------- Appointment List ---------- */}
      {appointments.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-500">You don't have any appointments yet.</p>
          <button
            onClick={() => navigate("/doctors")}
            className="mt-5 bg-[#5F6FFF] text-white text-sm font-medium px-8 py-2.5 rounded-full hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300"
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((item) => {
            // Backend sends docData; fall back to static data
            const doc =
              item.docData || doctors.find((d) => d._id === item.docId);
            if (!doc) return null;

            const status = getStatus(item);
            const isUpcoming = status === "upcoming";

            return (
              <div
                key={item._id}
                className="border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:border-[#5F6FFF] transition-all duration-300"
              >
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-xl bg-indigo-50"
                />

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-lg font-semibold text-gray-900">
                        {doc.name}
                      </p>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[status]}`}
                      >
                        {statusLabel[status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {doc.degree} - {doc.speciality}
                    </p>
                    {doc.address && (
                      <p className="text-sm text-gray-500 mt-2">
                        {doc.address.line1}, {doc.address.line2}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 font-medium mt-2">
                      {formatDate(parseSlotDate(item.slotDate))} |{" "}
                      {item.slotTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Fee:{" "}
                      <span className="text-gray-700 font-medium">
                        {currency}
                        {item.amount ?? doc.fees}
                      </span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-3 shrink-0">
                    {isUpcoming ? (
                      <>
                        {item.payment ? (
                          <span className="text-center text-sm font-medium text-green-600 bg-green-50 px-6 py-2.5 rounded-full">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePay(item._id)}
                            className="bg-[#5F6FFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300"
                          >
                            Pay Online
                          </button>
                        )}
                        <button
                          onClick={() => handleCancel(item._id)}
                          className="border border-gray-300 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-full hover:border-red-400 hover:text-red-500 active:scale-95 transition-all duration-300"
                        >
                          Cancel Appointment
                        </button>
                      </>
                    ) : (
                      <img
                        src={assets.verified_icon}
                        alt=""
                        className={`w-6 h-6 self-center sm:self-end ${
                          status === "cancelled" ? "opacity-30 grayscale" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
