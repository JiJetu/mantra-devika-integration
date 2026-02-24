import { useState } from "react";
import { Plus, Trash2, SquarePen } from "lucide-react";
import Heading from "../../components/shared/Heading";
import Modal from "../../components/ui/Modal";
import AddBanner from "../../components/dashboard/PromotionsDiscounts/AddBanner";
import EditBanner from "../../components/dashboard/PromotionsDiscounts/EditBanner";
import AddHeadingAnnouncement from "../../components/dashboard/PromotionsDiscounts/AddHeadingAnnouncement";
import EditHeadingAnnouncement from "../../components/dashboard/PromotionsDiscounts/EditHeadingAnnouncement";
import AddPromoCode from "../../components/dashboard/PromotionsDiscounts/AddPromoCode";
import EditPromoCode from "../../components/dashboard/PromotionsDiscounts/EditPromoCode";
import AddPopup from "../../components/dashboard/PromotionsDiscounts/AddPopup";
import { IMAGES } from "../../assets";
import Pagination from "../../components/shared/Pagination";
import EditPopup from "../../components/dashboard/PromotionsDiscounts/EditPopup";
import { useListBannersQuery, useDeleteBannerMutation, useListHeadingsQuery, useDeleteHeadingMutation, useListPopupsQuery, useDeletePopupMutation, useListCouponsQuery, useDeleteCouponMutation } from "../../redux/features/dashboard/promotion";
import { message } from "antd";

// Fake data for sections other than banners

const fakeHeadingAnnouncements = [
  {
    id: 1,
    title: "SUMMER20",
    status: "active",
  },
  {
    id: 2,
    title: "NEWUSER10",
    status: "active",
  },
];

const fakePopups = [
  {
    id: 1,
    image: "Promotional Pop-ups.jpg",
    status: "active",
  },
];

const PromotionsDiscounts = () => {
  const [activeTab, setActiveTab] = useState("websiteBanners");
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: bannersData, isFetching: loadingBanners } = useListBannersQuery();
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();
  const { data: headingsData, isFetching: loadingHeadings } = useListHeadingsQuery(undefined, { skip: activeTab !== "headingAnnouncement" });
  const [deleteHeading, { isLoading: deletingHeading }] = useDeleteHeadingMutation();
  const { data: popupsData, isFetching: loadingPopups } = useListPopupsQuery(undefined, { skip: activeTab !== "popUps" });
  const [deletePopup, { isLoading: deletingPopup }] = useDeletePopupMutation();
  const [couponPage, setCouponPage] = useState(1);
  const couponPageSize = 10;
  const { data: couponsData, isFetching: loadingCoupons } = useListCouponsQuery(
    { page: couponPage, page_size: couponPageSize },
    { skip: activeTab !== "promoCode" }
  );
  const [deleteCoupon, { isLoading: deletingCoupon }] = useDeleteCouponMutation();

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const mapBanners = (list) =>
    (Array.isArray(list) ? list : []).map((b, idx) => ({
      id: b.banner_id ?? b.id ?? idx + 1,
      title: b.title ?? "",
      description: b.description ?? "",
      status: b.is_active ? "active" : "inactive",
      image: b.image ?? b.image_url ?? IMAGES.product,
      video: b.video ?? b.video_url ?? null,
    }));

  const getTabData = () => {
    switch (activeTab) {
      case "websiteBanners":
        return mapBanners(bannersData);
      case "headingAnnouncement":
        return (Array.isArray(headingsData) ? headingsData : []).map((h, idx) => ({
          id: h.announcement_id ?? h.id ?? idx + 1,
          title: h.title ?? "",
          status: h.is_active ? "active" : "inactive",
          startDate: h.start_date,
          endDate: h.end_date,
        }));
      case "promoCode":
        {
          const list = Array.isArray(couponsData) ? couponsData : (couponsData?.results ?? []);
          return list.map((c, idx) => ({
            id: c.cupon_id ?? c.coupon_id ?? c.id ?? idx + 1,
            code: c.code ?? "",
            discount: parseFloat(c.discount_percentage) || c.discount || 0,
            maxDiscount: parseFloat(c.max_discount_amount) || 0,
            status: c.active ? "active" : "inactive",
            startDate: c.valid_from,
            endDate: c.valid_to,
          }));
        }
      case "popUps":
        return (Array.isArray(popupsData) ? popupsData : []).map((p, idx) => ({
          id: p.announcement_id ?? p.id ?? idx + 1,
          image: p.image ?? p.image_url ?? IMAGES.product,
          title: p.title ?? "",
          description: p.description ?? "",
          status: p.is_active ? "active" : "inactive",
          startDate: p.start_date,
          endDate: p.end_date,
        }));
      default:
        return [];
    }
  };

  const tabData = getTabData();

  const getTabTitle = () => {
    switch (activeTab) {
      case "websiteBanners":
        return "Website Banners";
      case "headingAnnouncement":
        return "Heading Announcement";
      case "promoCode":
        return "Promo Code";
      case "popUps":
        return "Promotional Pop-ups";
      default:
        return "";
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case "websiteBanners":
        return "Add Banner";
      case "headingAnnouncement":
        return "Heading Announcement";
      case "promoCode":
        return "Add Promo Code";
      case "popUps":
        return "Create Pop-up";
      default:
        return "";
    }
  };

  const getHeaders = () => {
    switch (activeTab) {
      case "headingAnnouncement":
        return ["Title", "Status", "Actions"];
      case "promoCode":
        return ["Code", "Discount", "Status", "Actions"];
      case "popUps":
        return ["Pop-up Image", "Status", "Actions"];
      default:
        return [];
    }
  };

  const headers = getHeaders();

  const handleDelete = async (item) => {
    try {
      if (activeTab === "websiteBanners") {
        await deleteBanner(item.id).unwrap();
        message.success("Banner deleted");
      } else if (activeTab === "headingAnnouncement") {
        await deleteHeading(item.id).unwrap();
        message.success("Heading announcement deleted");
      } else if (activeTab === "promoCode") {
        await deleteCoupon(item.id).unwrap();
        message.success("Coupon deleted");
      } else if (activeTab === "popUps") {
        await deletePopup(item.id).unwrap();
        message.success("Pop-up deleted");
      }
    } catch {
      message.error("Delete failed");
    }
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 lg:space-y-10">
        {/* Header */}
        <Heading
          title="Promotions & Discounts"
          subtitle="Manage banners, promo codes, and pop-ups"
        />

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("websiteBanners")}
            className={`flex-1 px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-t-lg font-medium text-sm md:text-base lg:text-lg transition-colors ${
              activeTab === "websiteBanners"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Website Banners
          </button>
          <button
            onClick={() => setActiveTab("headingAnnouncement")}
            className={`flex-1 px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-t-lg font-medium text-sm md:text-base lg:text-lg transition-colors ${
              activeTab === "headingAnnouncement"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Heading Announcement
          </button>
          <button
            onClick={() => setActiveTab("promoCode")}
            className={`flex-1 px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-t-lg font-medium text-sm md:text-base lg:text-lg transition-colors ${
              activeTab === "promoCode"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Promo Code
          </button>
          <button
            onClick={() => setActiveTab("popUps")}
            className={`flex-1 px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-t-lg font-medium text-sm md:text-base lg:text-lg transition-colors ${
              activeTab === "popUps"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pop-ups
          </button>
        </div>

        {/* Section Title + Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
            {getTabTitle()}
          </h3>
          <button
            onClick={() => openModal(`add${activeTab}`)}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm md:text-base"
          >
            <Plus size={18} />
            {getAddButtonText()}
          </button>
        </div>

        {/* Conditional Render: List for websiteBanners, Table for others */}
        {activeTab === "websiteBanners" || activeTab === "popUps" ? (
          <div className="space-y-2 md:space-y-3 lg:space-y-4">
            {(activeTab === "websiteBanners" && loadingBanners) || (activeTab === "popUps" && loadingPopups) ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : tabData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white px-4 py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 md:gap-4 lg:gap-5 flex-1">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <img
                      src={item.image}
                      alt="icon"
                      className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                      {item.title || item.code || item.image}
                    </p>
                    <p className="text-sm md:text-base text-gray-500 mt-0.5">
                      {item.description || item.discount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
                  <span className="inline-block px-3 py-1 text-xs md:text-sm lg:text-base font-medium rounded-full bg-green-100 text-green-700">
                    {item.status}
                  </span>
                  
                  <button
                    onClick={() => openModal(`edit${activeTab}`, item)}
                    className="text-primary transition-colors"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={(deleting && activeTab === "websiteBanners") || (deletingPopup && activeTab === "popUps")}
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-60"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {headers.map((header, idx) => (
                      <th
                        key={idx}
                        className={`px-6 py-4 text-sm md:text-base lg:text-lg font-semibold text-gray-700 ${idx === 0 ? "text-start" : "text-center"}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(activeTab === "headingAnnouncement" && loadingHeadings) || (activeTab === "promoCode" && loadingCoupons) ? (
                    <tr><td className="px-6 py-4" colSpan={headers.length}>Loading...</td></tr>
                  ) : tabData.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors text-start`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.title || item.code || item.image}
                      </td>
                      {activeTab === "promoCode" && (
                        <td className="px-6 py-4 text-[#00A63E] text-center">
                          %{item.description || item.discount}% OFF
                        </td>
                      )}

                      {
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 text-xs md:text-sm lg:text-base font-medium rounded-full bg-green-100 text-green-700">
                            {item.status}
                          </span>
                        </td>
                      }
                      <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(`edit${activeTab}`, item)}
                          className="text-primary transition-colors"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={(activeTab === "headingAnnouncement" && deletingHeading) || (activeTab === "promoCode" && deletingCoupon)}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-60"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeTab === "promoCode" && (
              <Pagination
                currentPage={couponPage}
                pageSize={couponPageSize}
                totalCount={couponsData?.count ?? (Array.isArray(couponsData?.results) ? couponsData.results.length : 0)}
                totalPages={couponsData?.total_pages}
                onPageChange={(page) => setCouponPage(page)}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === "addwebsiteBanners"}
        onClose={closeModal}
        title="Add New Banner"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <AddBanner onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "editwebsiteBanners"}
        onClose={closeModal}
        title="Edit Banner"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <EditBanner item={selectedItem} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "addheadingAnnouncement"}
        onClose={closeModal}
        title="Create Heading Announcement"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <AddHeadingAnnouncement onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "editheadingAnnouncement"}
        onClose={closeModal}
        title="Edit Heading Announcement"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <EditHeadingAnnouncement item={selectedItem} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "addpromoCode"}
        onClose={closeModal}
        title="Add Promo Code"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <AddPromoCode onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "editpromoCode"}
        onClose={closeModal}
        title="Edit Promo Code"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <EditPromoCode item={selectedItem} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "addpopUps"}
        onClose={closeModal}
        title="Create Pop-up"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <AddPopup onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "editpopUps"}
        onClose={closeModal}
        title="Edit Pop-up"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <EditPopup item={selectedItem} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default PromotionsDiscounts;
