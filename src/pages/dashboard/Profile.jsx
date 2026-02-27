import { useState } from "react";
import { Mail, Globe, User, Shield, Pencil, CircleCheckBig } from "lucide-react";
import Modal from "../../components/ui/Modal";
import EditProfileModal from "../../components/dashboard/profile/EditProfileModal";
import { useGetAdminUserQuery } from "../../redux/features/dashboard/dashboard.api";
import { useListSocialLinksQuery } from "../../redux/features/dashboard/socialMedia";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: admin } = useGetAdminUserQuery();
  const { data: socialLinks = [], isFetching: loadingLinks } = useListSocialLinksQuery();
  
    const fullName =
      [admin?.first_name, admin?.last_name].filter(Boolean).join(" ") ||
      "Admin User";
    const email = admin?.email || "admin@maantra.com";
    const shortName = fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const user = {
    // phone: "+1 (555) 123-4567",
    // location: "San Francisco, CA",
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
              <h2 className="text-2xl text-gray-900">{fullName}</h2>
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
                      <div className="font-medium">{fullName}</div>
                    </div>
                    {/* <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Phone Number
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={17} className="text-gray-500" />
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    </div> */}
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
                        <span className="font-medium">{email}</span>
                      </div>
                    </div>
                    {/* <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Location
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={17} className="text-gray-500" />
                        <span className="font-medium">{user.location}</span>
                      </div>
                    </div> */}
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
                  {loadingLinks && (
                    <div className="text-gray-500 text-sm">Loading...</div>
                  )}
                  {!loadingLinks &&
                    (Array.isArray(socialLinks) ? socialLinks : []).map((link) => (
                      <div key={link.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border">
                          {link.icon ? (
                            <img
                              src={link.icon}
                              alt={link.platform}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-[#5B0D0D] font-medium">{link.platform}</div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 underline"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                    ))}
                  {!loadingLinks && Array.isArray(socialLinks) && socialLinks.length === 0 && (
                    <div className="text-gray-500 text-sm">No social links found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {/* <div className="mt-8 bg-white rounded-xl border border-[#F9EFD5] p-6">
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
            </div> */}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        className="max-w-4xl"
      >
        <EditProfileModal onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Profile;
