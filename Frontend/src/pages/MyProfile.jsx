
import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const stats = [
  { label: "Total Appointments", value: 12 },
  { label: "Upcoming", value: 3 },
  { label: "Completed", value: 9 },
];

const getInitialProfile = (userData) => ({
  name: userData?.name || "",
  email: userData?.email || "",
  phone: userData?.phone || "",
  gender: userData?.gender || "Not Selected",
  dob: userData?.dob ? userData.dob.slice(0, 10) : "",
  image: userData?.image || "",
  cover: userData?.cover || "",
  address: {
    line1: userData?.address?.line1 || "",
    line2: userData?.address?.line2 || "",
  },
});

const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const formatDob = (dob) => {
  if (!dob) return "-";

  return new Date(dob).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Field = ({
  label,
  value,
  isEdit,
  onChange,
  type = "text",
  options,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      {label}
    </p>

    {isEdit ? (
      options ? (
        <select
          value={value}
          onChange={onChange}
          className="mt-1.5 w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:border-[#5F6FFF] focus:ring-2 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:border-[#5F6FFF] focus:ring-2 focus:ring-indigo-100"
        />
      )
    ) : (
      <p className="mt-1.5 text-sm font-medium text-gray-900">
        {type === "date" ? formatDob(value) : value || "-"}
      </p>
    )}
  </div>
);

const MyProfile = () => {
  // Get user data from AppContext
  const { userData, setuserData } = useContext(AppContext);

  // Initialize profile state
  const [profileData, setProfileData] = useState(() =>
    getInitialProfile(userData)
  );

  const [isEdit, setIsEdit] = useState(false);
  const [backup, setBackup] = useState(() =>
    getInitialProfile(userData)
  );

  // Update profile when userData becomes available
  useEffect(() => {
    if (userData && !isEdit) {
      const updatedProfile = getInitialProfile(userData);
      setProfileData(updatedProfile);
      setBackup(updatedProfile);
    }
  }, [userData]);

  // Handle edit
  const handleEdit = () => {
    setBackup({ ...profileData });
    setIsEdit(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setProfileData(backup);
    setIsEdit(false);
  };

  // Handle save
  const handleSave = () => {
    // Update profile in AppContext
    setuserData({
      ...userData,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      gender: profileData.gender,
      dob: profileData.dob,
      image: profileData.image,
      address: profileData.address,
    });

    setIsEdit(false);
  };

  // Handle image upload and preview
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfileData((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">

      {/* Header Card */}
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">

        {/* Cover Image */}
        <div className="relative h-32 sm:h-40 rounded-t-2xl overflow-hidden group">
          {profileData.cover ? (
            <img
              src={profileData.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#5F6FFF] via-indigo-500 to-violet-500" />
          )}

          {isEdit && (
            <label
              htmlFor="cover-upload"
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 cursor-pointer text-white"
            >
              <img
                src={assets.upload_icon}
                alt=""
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">
                Change cover
              </span>
            </label>
          )}

          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
            disabled={!isEdit}
            hidden
          />

          {isEdit && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Editing
            </span>
          )}
        </div>

        <div className="px-6 sm:px-10 pb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

              {/* Profile Picture */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 group">

                <img
                  src={profileData.image || assets.profile_pic}
                  alt={profileData.name}
                  className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
                />

                {isEdit && (
                  <label
                    htmlFor="profile-pic-upload"
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer text-white"
                  >
                    <img
                      src={assets.upload_icon}
                      alt=""
                      className="w-6 h-6"
                    />
                    <span className="text-[11px] font-medium">
                      Change photo
                    </span>
                  </label>
                )}

                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  disabled={!isEdit}
                  hidden
                />
              </div>

              {/* User Information */}
              <div className="pb-1 sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profileData.name}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  {profileData.email}
                </p>

                <span className="inline-block mt-2 text-xs font-semibold text-[#5F6FFF] bg-indigo-50 px-3 py-1 rounded-full">
                  Patient
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:pb-2">

              {!isEdit ? (
                <button
                  onClick={handleEdit}
                  className="bg-[#5F6FFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="border border-gray-300 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="bg-[#5F6FFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8">
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
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-[#5F6FFF]">
            <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">

          <Field
            label="Email"
            type="email"
            value={profileData.email}
            isEdit={isEdit}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                email: e.target.value,
              })
            }
          />

          <Field
            label="Phone"
            value={profileData.phone}
            isEdit={isEdit}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                phone: e.target.value,
              })
            }
          />

          <Field
            label="Address Line 1"
            value={profileData.address.line1}
            isEdit={isEdit}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                address: {
                  ...profileData.address,
                  line1: e.target.value,
                },
              })
            }
          />

          <Field
            label="Address Line 2"
            value={profileData.address.line2}
            isEdit={isEdit}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                address: {
                  ...profileData.address,
                  line2: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className="mt-6 border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-10">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-[#5F6FFF]">
            <Icon path="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">

          <Field
            label="Gender"
            value={profileData.gender}
            isEdit={isEdit}
            options={["Male", "Female", "Other"]}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                gender: e.target.value,
              })
            }
          />

          <Field
            label="Birthday"
            type="date"
            value={profileData.dob}
            isEdit={isEdit}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                dob: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
