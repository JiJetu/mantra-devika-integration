import { useState, useEffect } from "react";
import { Globe, Plus, Trash2, Pencil } from "lucide-react";
import { message } from "antd";
import {
  useListSocialLinksQuery,
  useCreateSocialLinkMutation,
  useEditSocialLinkMutation,
  useDeleteSocialLinkMutation,
} from "../../../redux/features/dashboard/socialMedia";

const EditProfileModal = ({ onClose }) => {
  const { data: links = [], refetch, isFetching } = useListSocialLinksQuery();
  const [createSocialLink, { isLoading: creating }] =
    useCreateSocialLinkMutation();
  const [editSocialLink, { isLoading: editing }] = useEditSocialLinkMutation();
  const [deleteSocialLink, { isLoading: deleting }] =
    useDeleteSocialLinkMutation();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addForm, setAddForm] = useState({ platform: "", url: "", icon: null });
  const [editForm, setEditForm] = useState({
    platform: "",
    url: "",
    icon: null,
  });

  useEffect(() => {
    if (editingId != null) {
      const current = Array.isArray(links)
        ? links.find((l) => l.id === editingId)
        : null;
      if (current) {
        setEditForm({
          platform: current.platform || "",
          url: current.url || "",
          icon: null,
        });
      }
    }
  }, [editingId, links]);

  const onAdd = async () => {
    if (!addForm.platform || !addForm.url) {
      message.error("Platform and URL are required");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("platform", addForm.platform);
      fd.append("url", addForm.url);
      if (addForm.icon) fd.append("icon", addForm.icon);
      await createSocialLink(fd).unwrap();
      setAddForm({ platform: "", url: "", icon: null });
      setAdding(false);
      message.success("Social link added");
      refetch();
    } catch {
      message.error("Failed to add social link");
    }
  };

  const onSaveEdit = async () => {
    if (editingId == null) return;
    try {
      const fd = new FormData();
      if (editForm.platform) fd.append("platform", editForm.platform);
      if (editForm.url) fd.append("url", editForm.url);
      if (editForm.icon) fd.append("icon", editForm.icon);
      await editSocialLink({ id: editingId, body: fd }).unwrap();
      setEditingId(null);
      message.success("Social link updated");
      refetch();
    } catch {
      message.error("Failed to update social link");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteSocialLink(id).unwrap();
      message.success("Social link deleted");
      refetch();
    } catch {
      message.error("Failed to delete social link");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg w-full overflow-hidden flex flex-col">
        <div className="py-6 pt-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                Social Media Links
              </h3>
            </div>

            <div className="flex justify-end">
              {!adding ? (
                <button
                  onClick={() => setAdding(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B0D0D] text-white rounded-md hover:bg-[#4A0A0A] transition-colors text-sm"
                >
                  <Plus size={16} /> Add Link
                </button>
              ) : (
                <div className="w-full bg-white border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Platform (e.g., Facebook)"
                      value={addForm.platform}
                      onChange={(e) =>
                        setAddForm((p) => ({ ...p, platform: e.target.value }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="URL"
                      value={addForm.url}
                      onChange={(e) =>
                        setAddForm((p) => ({ ...p, url: e.target.value }))
                      }
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setAddForm((p) => ({
                          ...p,
                          icon: e.target.files?.[0] || null,
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-xs text-gray-600 w-full">
                      {addForm.icon
                        ? `Selected icon: ${addForm.icon.name}`
                        : "No icon selected"}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setAdding(false);
                        setAddForm({ platform: "", url: "", icon: null });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onAdd}
                      disabled={creating}
                      className="px-4 py-2 bg-[#5B0D0D] text-white rounded-md text-sm disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">Icon</th>
                    <th className="px-3 py-2 text-left">Platform</th>
                    <th className="px-3 py-2 text-left">URL</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(links) ? links : []).map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2">
                        {item.icon ? (
                          <img
                            src={item.icon}
                            alt={item.platform}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {editingId === item.id ? (
                          <input
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={editForm.platform}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                platform: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <span className="font-medium">{item.platform}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {editingId === item.id ? (
                          <input
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={editForm.url}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                url: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#5B0D0D] underline"
                          >
                            {item.url}
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === item.id ? (
                            <>
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setEditForm((p) => ({
                                    ...p,
                                    icon: e.target.files?.[0] || null,
                                  }))
                                }
                              />
                              <div className="text-xs text-gray-600">
                                {item.icon
                                  ? "Current icon available"
                                  : "No current icon"}
                                {editForm.icon
                                  ? ` • New: ${editForm.icon.name}`
                                  : ""}
                              </div>
                            </div>
                              
                              <button
                                onClick={onSaveEdit}
                                disabled={editing}
                                className="px-3 py-1 bg-[#5B0D0D] text-white rounded text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 border border-gray-300 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingId(item.id)}
                                className="p-1.5 hover:bg-gray-100 rounded"
                                title="Edit"
                              >
                                <Pencil size={16} className="text-[#5B0D0D]" />
                              </button>
                              <button
                                onClick={() => onDelete(item.id)}
                                disabled={deleting}
                                className="p-1.5 hover:bg-gray-100 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} className="text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {isFetching && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!isFetching &&
                    Array.isArray(links) &&
                    links.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-4 text-center text-gray-500"
                        >
                          No social links found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close
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
