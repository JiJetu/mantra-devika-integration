import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, User, Mail, Phone, MapPin, Globe } from "lucide-react";

const EditProfileModal = ({ user, onClose }) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      businessEmail: "support@ecommerce.com",
      businessPhone: "+1 234 567 8900",
      businessAddress: user.businessAddress,
      facebook: user.social.facebook,
      tiktok: user.social.tiktok,
      instagram: user.social.instagram,
      twitter: user.social.twitter,
      linkedin: user.social.linkedin,
    },
  });

  // Profile photo preview & file
  const [profilePreview, setProfilePreview] = useState(user?.profilePhoto || null);
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("location", user.location);
      setValue("businessAddress", user.businessAddress);
      setValue("facebook", user.social.facebook);
      setValue("instagram", user.social.instagram);
      setValue("twitter", user.social.twitter);
      setValue("linkedin", user.social.linkedin);

      // Show existing profile photo
      setProfilePreview(user.profilePhoto || null);
      setProfileFile(null);
    }
  }, [user, setValue]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const removeProfilePreview = () => {
    setProfilePreview(null);
    setProfileFile(null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // Text fields
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("location", data.location);
    formData.append("businessEmail", data.businessEmail);
    formData.append("businessPhone", data.businessPhone);
    formData.append("businessAddress", data.businessAddress);
    formData.append("tiktok", data.tiktok);
    formData.append("facebook", data.facebook);
    formData.append("instagram", data.instagram);
    formData.append("twitter", data.twitter);
    formData.append("linkedin", data.linkedin);

    // Profile photo
    if (profileFile) {
      formData.append("profilePhoto", profileFile);
    }

    console.log("Submitting profile update FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // → Here: axios.put('/api/profile', formData)

    onClose();
  };

  return (
    <div>
      <div className="bg-white rounded-lg w-full overflow-hidden flex flex-col">
        {/* Scrollable Content */}
        <div className="py-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Full Name *
                </label>
                <input
                  {...register("fullName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Email Address *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="profile-photo"
                    className="px-4 py-1.5 bg-[#5B0D0D] text-white rounded-md hover:bg-[#4A0A0A] transition-colors text-sm cursor-pointer"
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                      id="profile-photo"
                    />
                  </label>
                  <span className="text-xs text-gray-500">
                    {profileFile ? profileFile.name : "No File Chosen"}
                  </span>
                </div>

                {profilePreview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={profilePreview}
                      alt="profile preview"
                      className="w-20 h-20 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePreview}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={18} className="text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h3>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-500" />
                  Email Address
                </label>
                <input
                  {...register("businessEmail")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-500" />
                  Phone Number
                </label>
                <input
                  {...register("businessPhone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-500" />
                  Business Address
                </label>
                <input
                  {...register("businessAddress")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">
                  Social Media Links
                </h3>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Tiktok
                </label>
                <input
                  {...register("tiktok")}
                  placeholder="https://tiktok.com/@yourstore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Facebook
                </label>
                <input
                  {...register("facebook")}
                  placeholder="https://facebook.com/yourstore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Instagram
                </label>
                <input
                  {...register("instagram")}
                  placeholder="https://instagram.com/yourstore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Twitter
                </label>
                <input
                  {...register("twitter")}
                  placeholder="https://twitter.com/yourstore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  LinkedIn
                </label>
                <input
                  {...register("linkedin")}
                  placeholder="https://linkedin.com/company/yourstore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B0D0D] focus:border-[#5B0D0D] text-sm"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2 bg-[#5B0D0D] text-white rounded-md hover:bg-[#4A0A0A] transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

// // Demo wrapper with sample data
// export default function App() {
//   const [showModal, setShowModal] = React.useState(true);

//   const sampleUser = {
//     fullName: "Admin User",
//     email: "admin@example.com",
//     phone: "+1 (555) 123-4567",
//     location: "San Francisco, CA",
//     businessAddress: "123 Business St, Suite 100, City, State 12345",
//     social: {
//       facebook: "https://facebook.com/yourstore",
//       instagram: "https://instagram.com/yourstore",
//       twitter: "https://twitter.com/yourstore",
//       linkedin: "https://linkedin.com/company/yourstore"
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       {showModal && (
//         <EditProfileModal 
//           user={sampleUser} 
//           onClose={() => setShowModal(false)} 
//         />
//       )}
//       {!showModal && (
//         <button
//           onClick={() => setShowModal(true)}
//           className="px-6 py-3 bg-[#5B0D0D] text-white rounded-lg hover:bg-[#4A0A0A] transition-colors font-medium"
//         >
//           Open Edit Profile Modal
//         </button>
//       )}
//     </div>
//   );
// }