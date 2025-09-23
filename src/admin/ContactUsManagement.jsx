"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import AdminProfileDropdown from "./AdminProfileDropdown";
import Footer from "../footer";
import { getCookie } from "../utils/cookieUtils";
import DeleteWarningPopup from "./components/DeleteWarningPopup";

const ContactUsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingContact, setDeletingContact] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Fetch contact data from backend
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/managecontactus.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });

        const data = await response.json();

        if (data.success) {
          // Transform the data to match the expected format
          const transformedData = data.data.map(contact => ({
            id: contact.id,
            sender: contact.name,
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            status: contact.status,
            receivedDate: contact.created_at.split(' ')[0], // Extract date part
            admin_id: contact.admin_id
          }));
          setContactData(transformedData);
        } else {
          setError(data.error || "Failed to fetch contact data");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const filteredData = contactData.filter((contact) => {
    const matchesSearch =
      contact.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const resetSearch = () => {
    setSearchQuery("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Read":
        return "bg-gray-100 text-gray-800"
      case "Responded":
        return "bg-gray-200 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setShowDeletePopup(true);
  }

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    
    try {
      setDeletingContact(contactToDelete.id);
      
      const token = getCookie('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/managecontactus.php?action=delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contactId: contactToDelete.id
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove the contact from the local state
        setContactData(prevContacts => 
          prevContacts.filter(contact => contact.id !== contactToDelete.id)
        );
        setShowDeletePopup(false);
        setContactToDelete(null);
      } else {
        throw new Error(result.error || 'Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
    } finally {
      setDeletingContact(null);
    }
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    setContactToDelete(null);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Hover-expand Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 bg-white shadow-lg flex flex-col transition-all duration-300
          ${sidebarHovered ? 'w-64' : 'w-20'}
        `}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <SidebarLinks sidebarOpen={sidebarHovered} />
        <div className="p-4 border-t border-gray-200 mt-auto flex justify-center">
          <AdminProfileDropdown />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-0 sm:ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="p-4 sm:p-6 md:p-8">
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Contact Us Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage inquiries submitted via the Contact Us form.</p>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by keyword or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors text-sm sm:text-base shadow"
                />
              </div>
              <button
                onClick={resetSearch}
                className="px-4 py-3 sm:py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm shadow"
              >
                Reset Search
              </button>
            </div>
          </div>



          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading contact submissions...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Error loading contact data:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Contact Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                                     <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                     <tr>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Sender</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Email</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Subject</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Message</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Received Date</th>
                       <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Actions</th>
                     </tr>
                   </thead>
                  <tbody className="divide-y divide-[#e6f4ea]">
                                         {filteredData.map((contact, index) => (
                       <tr key={index} className="hover:bg-[#f7f9fb]">
                         <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{contact.sender}</td>
                         <td className="px-6 py-4 text-sm text-[#618170]">{contact.email}</td>
                         <td className="px-6 py-4 text-sm text-[#3a5f46]">{contact.subject}</td>
                         <td className="px-6 py-4 text-sm text-[#618170] max-w-xs truncate" title={contact.message}>
                           {contact.message}
                         </td>
                         <td className="px-6 py-4">
                           <span
                             className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}
                           >
                             {contact.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-sm text-[#618170]">{contact.receivedDate}</td>
                         <td className="px-6 py-4">
                           <div className="flex space-x-2">
                             <button
                               onClick={() => handleDeleteClick(contact)}
                               disabled={deletingContact === contact.id}
                               className={`font-semibold px-3 py-1 rounded-full shadow transition text-xs ${
                                 deletingContact === contact.id
                                   ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                   : 'bg-red-600 hover:bg-red-700 text-white'
                               }`}
                             >
                               {deletingContact === contact.id ? 'Deleting...' : 'Delete'}
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#618170]">No contact inquiries found matching your criteria.</p>
                </div>
              )}
            </div>
          )}






        </main>
        <div className="mb-32"></div>
        <Footer admin={true} />
      </div>

      {/* Delete Warning Popup */}
      <DeleteWarningPopup
        isOpen={showDeletePopup}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message="Are you sure you want to delete this contact inquiry?"
        itemName={contactToDelete?.sender || ""}
        isLoading={deletingContact !== null}
      />
    </div>
  )
}

export default ContactUsManagement