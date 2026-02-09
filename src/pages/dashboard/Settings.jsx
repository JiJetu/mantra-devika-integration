import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetTermsPolicyQuery,
  useUpsertTermsPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpsertPrivacyPolicyMutation,
  useGetShippingPolicyQuery,
  useUpsertShippingPolicyMutation,
  useGetRefundPolicyQuery,
  useUpsertRefundPolicyMutation,
} from "../../redux/features/dashboard/policies";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [isEditing, setIsEditing] = useState(false);
  const editor = useRef(null);
  const { data: termsAPI } = useGetTermsPolicyQuery();
  const { data: privacyAPI } = useGetPrivacyPolicyQuery();
  const { data: shippingAPI } = useGetShippingPolicyQuery();
  const { data: refundAPI } = useGetRefundPolicyQuery();
  const [upsertTerms, { isLoading: savingTerms }] = useUpsertTermsPolicyMutation();
  const [upsertPrivacy, { isLoading: savingPrivacy }] = useUpsertPrivacyPolicyMutation();
  const [upsertShipping, { isLoading: savingShipping }] = useUpsertShippingPolicyMutation();
  const [upsertRefund, { isLoading: savingRefund }] = useUpsertRefundPolicyMutation();

  // Store original content to revert on cancel
  const [originalContent, setOriginalContent] = useState({
    terms: { title: "", content: "" },
    privacy: { title: "", content: "" },
    shipping: { title: "", content: "" },
    refund: { title: "", content: "" },
  });

  useEffect(() => {
    if (termsAPI?.policy) {
      setTermsData((prev) => ({ ...prev, content: termsAPI.policy }));
    }
    if (privacyAPI?.policy) {
      setPrivacyData((prev) => ({ ...prev, content: privacyAPI.policy }));
    }
    if (shippingAPI?.policy) {
      setShippingData((prev) => ({ ...prev, content: shippingAPI.policy }));
    }
    if (refundAPI?.policy) {
      setRefundData((prev) => ({ ...prev, content: refundAPI.policy }));
    }
  }, [termsAPI, privacyAPI, shippingAPI, refundAPI]);

  // Fake data - will be replaced with API data later
  const [termsData, setTermsData] = useState({
    title: "Terms and Conditions",
    content: `
      <h2>Terms of Service</h2>
      <p>Lorem ipsum dolor sit amet consectetur. Fringilla a cras orci. Egestas id nisi sed congue scelerisque.</p>
      <ul>
        <li>Eleifend facilisis aliquet tempus morbi turpis sagittis.</li>
        <li>Pharetra duis habitasse convallis luctus pulvinar.</li>
        <li>Pharetra nunc morbi elementum magnis convallis arcu enim tortor.</li>
      </ul>
      <p>Cursus a sed tortor enim imperdiet mauris. Sem morbi non semper eget cursus vulputate id volutpat quis.</p>
    `,
  });

  const [privacyData, setPrivacyData] = useState({
    title: "Privacy Policy",
    content: `
      <h2>Privacy Policy</h2>
      <p>Lorem ipsum dolor sit amet consectetur. Fringilla a cras orci. Egestas id nisi sed congue scelerisque.</p>
      <p>Eleifend facilisis aliquet tempus morbi turpis sagittis. Pharetra duis habitasse convallis luctus pulvinar.</p>
      <h3>Information We Collect</h3>
      <ul>
        <li>Personal identification information</li>
        <li>Usage data</li>
        <li>Cookies and tracking data</li>
      </ul>
      <p>Pharetra nunc morbi elementum magnis convallis arcu enim tortor. Cursus a sed tortor enim imperdiet mauris.</p>
    `,
  });

  const [shippingData, setShippingData] = useState({
    title: "Shipping Policy",
    content: `
      <h2>Shipping Policy</h2>
      <p>We aim to process and dispatch all orders within 1-2 business days. Once dispatched, delivery times may vary based on your location.</p>
      
      <h3>Delivery Timeframes</h3>
      <ul>
        <li><strong>Standard Shipping:</strong> 5-7 business days</li>
        <li><strong>Express Shipping:</strong> 2-3 business days</li>
        <li><strong>Priority Shipping:</strong> 1-2 business days</li>
      </ul>
      
      <h3>Shipping Costs</h3>
      <p>Shipping costs are calculated based on the weight of your order and your delivery location. Free shipping is available on orders over $50.</p>
      
      <h3>International Shipping</h3>
      <p>We ship to most countries worldwide. International delivery typically takes 10-14 business days. Additional customs duties and taxes may apply.</p>
    `,
  });

  const [refundData, setRefundData] = useState({
    title: "Refund and Exchange Policy",
    content: `
      <h2>Refund and Exchange Policy</h2>
      <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>
      
      <h3>Return Period</h3>
      <ul>
        <li>You have 30 days from the delivery date to return an item</li>
        <li>Items must be in their original condition: unworn, unwashed, and with all tags attached</li>
        <li>Original packaging should be included when possible</li>
      </ul>
      
      <h3>Refund Process</h3>
      <ol>
        <li>Contact our customer service team to initiate a return</li>
        <li>We'll provide you with a return authorization number and shipping label</li>
        <li>Once we receive and inspect the item, we'll process your refund</li>
        <li>Refunds are issued to the original payment method within 5-10 business days</li>
      </ol>
      
      <h3>Exchanges</h3>
      <p>We offer exchanges for size or color within 30 days of purchase. If the item you want is out of stock, we'll issue a refund instead.</p>
      
      <h3>Non-Returnable Items</h3>
      <ul>
        <li>Personalized or custom-made items</li>
        <li>Gift cards</li>
        <li>Intimate apparel (for hygiene reasons)</li>
        <li>Items marked as "Final Sale"</li>
      </ul>
    `,
  });

  // Store current content in ref to avoid re-renders
  const [currentContent, setCurrentContent] = useState({
    title: "",
    content: "",
  });

  // Update current content when tab changes or editing starts
  useEffect(() => {
    let data;
    switch (activeTab) {
      case "terms":
        data = termsData;
        break;
      case "privacy":
        data = privacyData;
        break;
      case "shipping":
        data = shippingData;
        break;
      case "refund":
        data = refundData;
        break;
      default:
        data = termsData;
    }

    setCurrentContent({
      title: data.title,
      content: data.content,
    });

    if (isEditing) {
      setOriginalContent((prev) => ({
        ...prev,
        [activeTab]: { ...data },
      }));
    }
  }, [activeTab, isEditing, termsData, privacyData, shippingData, refundData]);

  // Jodit Editor Configuration
  const config = {
    readonly: false,
    toolbar: true,
    spellcheck: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "|",
      "fullsize",
      "preview",
      "print",
    ],
    buttonsMD: "bold,italic,underline,|,ul,ol,|,font,fontsize,|,align",
    buttonsSM: "bold,italic,underline,|,ul,ol,|,align",
    buttonsXS: "bold,italic,underline,|,ul,ol",
    toolbarAdaptive: false,
    minHeight: 400,
    maxHeight: 600,
    placeholder: "Start typing here...",
    style: {
      fontSize: "16px",
      fontFamily: "inherit",
    },
    autofocus: false,
    events: {
      afterInit: function (editor) {
        // You can add custom initialization here if needed
      },
    },
  };

  // Get active data based on tab
  const getActiveData = () => {
    switch (activeTab) {
      case "terms":
        return termsData;
      case "privacy":
        return privacyData;
      case "shipping":
        return shippingData;
      case "refund":
        return refundData;
      default:
        return termsData;
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setCurrentContent((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  // Handle content change
  const handleContentChange = (newContent) => {
    setCurrentContent((prev) => ({
      ...prev,
      content: newContent,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      switch (activeTab) {
        case "terms":
          await upsertTerms(currentContent.content).unwrap();
          setTermsData({
            title: currentContent.title,
            content: currentContent.content,
          });
          break;
        case "privacy":
          await upsertPrivacy(currentContent.content).unwrap();
          setPrivacyData({
            title: currentContent.title,
            content: currentContent.content,
          });
          break;
        case "shipping":
          await upsertShipping(currentContent.content).unwrap();
          setShippingData({
            title: currentContent.title,
            content: currentContent.content,
          });
          break;
        case "refund":
          await upsertRefund(currentContent.content).unwrap();
          setRefundData({
            title: currentContent.title,
            content: currentContent.content,
          });
          break;
        default:
          break;
      }
      toast.success(`${currentContent.title} saved successfully!`);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save policy");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Revert to original content
    if (originalContent[activeTab]) {
      setCurrentContent({
        title: originalContent[activeTab].title,
        content: originalContent[activeTab].content,
      });
    }
    setIsEditing(false);
  };

  // Handle edit button click
  const handleEditClick = () => {
    const data = getActiveData();
    setOriginalContent((prev) => ({
      ...prev,
      [activeTab]: { ...data },
    }));
    setCurrentContent({
      title: data.title,
      content: data.content,
    });
    setIsEditing(true);
  };

  const activeData = getActiveData();

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10">
      {/* Header */}
      {/* <Heading
        title="Settings"
        subtitle="Manage your terms & conditions, privacy policy, shipping policy, and refund policy"
      /> */}

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 md:gap-4 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("terms");
            setIsEditing(false);
          }}
          className={`px-4 py-2.5 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
            activeTab === "terms"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => {
            setActiveTab("privacy");
            setIsEditing(false);
          }}
          className={`px-4 py-2.5 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
            activeTab === "privacy"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => {
            setActiveTab("shipping");
            setIsEditing(false);
          }}
          className={`px-4 py-2.5 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
            activeTab === "shipping"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Shipping Policy
        </button>
        <button
          onClick={() => {
            setActiveTab("refund");
            setIsEditing(false);
          }}
          className={`px-4 py-2.5 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
            activeTab === "refund"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Refund & Exchange
        </button>
      </div>

      {/* Editor Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-8">
        {/* Title and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-end gap-4 mb-6">
          {/* <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {isEditing ? currentContent.title : activeData.title}
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {activeTab === "terms" && "Terms"}
              {activeTab === "privacy" && "Privacy"}
              {activeTab === "shipping" && "Shipping"}
              {activeTab === "refund" && "Refund"}
            </span>
          </div> */}

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={
                    activeTab === "terms"
                      ? savingTerms
                      : activeTab === "privacy"
                      ? savingPrivacy
                      : activeTab === "shipping"
                      ? savingShipping
                      : savingRefund
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                <Edit size={16} />
                Edit Content
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {isEditing ? (
          <>
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Title
              </label>
              <input
                type="text"
                value={currentContent.title}
                onChange={handleTitleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                placeholder="Enter title here..."
                autoFocus
              />
            </div>

            {/* Jodit Editor */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editor}
                value={currentContent.content}
                config={config}
                onBlur={(newContent) => handleContentChange(newContent)}
              />
            </div>

            {/* Editor Instructions */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Editor Tips:</span>
              </p>
              <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                <li>Use headings (H2, H3) to organize your policy sections</li>
                <li>
                  Use bullet points for lists and step-by-step instructions
                </li>
                <li>Add bold text for important terms and conditions</li>
                <li>Preview your content before saving</li>
              </ul>
            </div>
          </>
        ) : (
          // View Mode
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[400px] overflow-y-auto">
            {/* <div className="mb-4 pb-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {activeData.title}
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {activeTab === "terms" && "Legal agreement between you and our company"}
                  {activeTab === "privacy" && "How we collect, use, and protect your data"}
                  {activeTab === "shipping" && "Delivery timelines, costs, and shipping methods"}
                  {activeTab === "refund" && "Return, refund, and exchange procedures"}
                </p>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                  View Mode
                </span>
              </div>
            </div> */}

            <div
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: activeData.content }}
            />

            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <div className="flex justify-between items-center">
                <div>
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs">
                  {activeTab === "terms" && "Terms ID: TOS-2024-001"}
                  {activeTab === "privacy" && "Privacy ID: PP-2024-001"}
                  {activeTab === "shipping" && "Shipping ID: SP-2024-001"}
                  {activeTab === "refund" && "Refund ID: REP-2024-001"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Guide Card */}
      {/* {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              How to edit policies:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">1</span>
                <span className="text-sm text-blue-800">Select the policy tab you want to edit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">2</span>
                <span className="text-sm text-blue-800">Click the <span className="font-medium">"Edit Content"</span> button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">3</span>
                <span className="text-sm text-blue-800">Use the rich text editor to update content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">4</span>
                <span className="text-sm text-blue-800">Click <span className="font-medium">"Save Changes"</span> or <span className="font-medium">"Cancel"</span></span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h4 className="text-lg font-semibold text-green-900 mb-3">
              Policy Types:
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="font-medium text-green-800">Terms & Conditions:</span>
                <p className="text-sm text-green-700 mt-1">Legal rules for using your website/services.</p>
              </li>
              <li>
                <span className="font-medium text-green-800">Privacy Policy:</span>
                <p className="text-sm text-green-700 mt-1">How you handle user data and privacy.</p>
              </li>
              <li>
                <span className="font-medium text-green-800">Shipping Policy:</span>
                <p className="text-sm text-green-700 mt-1">Delivery methods, timelines, and costs.</p>
              </li>
              <li>
                <span className="font-medium text-green-800">Refund & Exchange:</span>
                <p className="text-sm text-green-700 mt-1">Return, refund, and exchange procedures.</p>
              </li>
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Settings;
