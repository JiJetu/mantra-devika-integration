import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  User,
  Shield,
  Pencil,
  CircleCheckBig,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import EditProfileModal from "../../components/dashboard/profile/EditProfileModal";
import { BsTiktok } from "react-icons/bs";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = {
    fullName: "Admin User",
    email: "admin@maantra.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Active",
    businessAddress: "123 Business St, Suite 100, City, State 12345",
    social: {
      facebook: "https://facebook.com/yourstore",
      tiktok: "https://tiktok.com/@yourstore",
      instagram: "https://instagram.com/yourstore",
      twitter: "https://twitter.com/yourstore",
      linkedin: "https://linkedin.com/company/yourstore",
    },
  };

  const shortName = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join(" ")
    .toUpperCase();

  return (
    <>
      <div className="space-y-6 md:space-y-8 lora">
        <div className="bg-white rounded-2xl shadow-sm border border-[#F9EFD5] overflow-hidden">
          {/* Pure Maroon Top Banner */}
          <div className="bg-[#5B0D0D] h-28 md:h-32"></div>

          {/* Overlapping Avatar */}
          <div className="relative -mt-14 ml-6 md:ml-8 inline-block">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-[#5B0D0D] rounded-full border-[7px] border-white flex items-center justify-center shadow">
              <span className="text-white text-3xl tracking-[-4px] lora">
                {shortName}
              </span>
            </div>
          </div>

          {/* Name, Role & Edit Button - Now in white area */}
          <div className="-mt-16 pl-[138px] md:pl-[170px] pr-6 md:pr-8 md:flex items-start justify-between space-y-4">
            <div>
              <h2 className="text-2xl text-gray-900">{user.fullName}</h2>
              <div className="flex items-center gap-1.5 text-gray-600 mt-1">
                <Shield size={18} />
                <span className="text-sm md:text-base">Admin</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#5B0D0D] hover:bg-[#4a0a0a] text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>

          {/* Content Area */}
          <div className="pt-12 px-6 md:px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-xl border border-[#F9EFD5] p-6 col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <User size={22} className="text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="md:flex space-y-3 md:space-y-0">
                  <div className="space-y-6 flex-1">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Full Name
                      </div>
                      <div className="font-medium">{user.fullName}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Phone Number
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={17} className="text-gray-500" />
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Status
                      </div>
                      <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        <span className="flex items-center gap-1">
                          <CircleCheckBig size={16} />
                          {user.status}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Email Address
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={17} className="text-gray-500" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Location
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={17} className="text-gray-500" />
                        <span className="font-medium">{user.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-xl border border-[#F9EFD5] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Globe size={22} className="text-[#9810FA]" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Social Media Links
                  </h3>
                </div>

                <div className="space-y-5">
                  {[
                    { Icon: BsTiktok, color: "#5B0D0D", label: "TikTok" },
                    { Icon: Facebook, color: "#1877F2", label: "Facebook" },
                    { Icon: Instagram, color: "#E1306C", label: "Instagram" },
                    { Icon: Twitter, color: "#1DA1F2", label: "Twitter" },
                    { Icon: Linkedin, color: "#0A66C2", label: "LinkedIn" },
                  ].map(({ Icon, color, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border">
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-[#5B0D0D]">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-white rounded-xl border border-[#F9EFD5] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail size={22} className="text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                      Email Address
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={17} className="text-gray-500" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                      Phone Number
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={17} className="text-gray-500" />
                      <span className="font-medium">{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Business Address
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={17} className="text-gray-500 mt-0.5" />
                    <span className="font-medium leading-snug">
                      {user.businessAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        className="max-w-lg"
      >
        <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Profile;
