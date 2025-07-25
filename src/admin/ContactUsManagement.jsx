"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import UserProfileDropdown from "../customer/UserProfileDropdown";
import Footer from "../footer";

const ContactUsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const contactData = [
    {
      sender: "Sophia Clark",
      email: "sophia.clark@email.com",
      subject: "Inquiry about recycling program",
      status: "New",
      receivedDate: "2024-03-15",
    },
    {
      sender: "Ethan Bennett",
      email: "ethan.bennett@email.com",
      subject: "Partnership opportunity",
      status: "Read",
      receivedDate: "2024-03-14",
    },
    {
      sender: "Olivia Carter",
      email: "olivia.carter@email.com",
      subject: "Feedback on service",
      status: "Responded",
      receivedDate: "2024-03-13",
    },
    {
      sender: "Liam Davis",
      email: "liam.davis@email.com",
      subject: "Question about waste disposal",
      status: "New",
      receivedDate: "2024-03-12",
    },
    {
      sender: "Ava Evans",
      email: "ava.evans@email.com",
      subject: "Complaint about pickup",
      status: "Read",
      receivedDate: "2024-03-11",
    },
    {
      sender: "Noah Foster",
      email: "noah.foster@email.com",
      subject: "Suggestion for improvement",
      status: "Responded",
      receivedDate: "2024-03-10",
    },
    {
      sender: "Isabella Green",
      email: "isabella.green@email.com",
      subject: "General inquiry",
      status: "New",
      receivedDate: "2024-03-09",
    },
    {
      sender: "Jackson Hayes",
      email: "jackson.hayes@email.com",
      subject: "Request for information",
      status: "Read",
      receivedDate: "2024-03-08",
    },
    {
      sender: "Mia Ingram",
      email: "mia.ingram@email.com",
      subject: "Issue with account",
      status: "Responded",
      receivedDate: "2024-03-07",
    },
    {
      sender: "Lucas Johnson",
      email: "lucas.johnson@email.com",
      subject: "Support request",
      status: "New",
      receivedDate: "2024-03-06",
    },
  ]

  const filters = ["All", "New", "Read", "Responded"]

  const filteredData = contactData.filter((contact) => {
    const matchesSearch =
      contact.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "All" || contact.status === activeFilter

    return matchesSearch && matchesFilter
  })

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

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const handleView = (contactId) => {
    console.log("View contact:", contactId)
    // Handle view contact logic
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = 5 // Based on the pagination shown in the image

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
          <UserProfileDropdown mode="admin" />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="p-4 sm:p-6 md:p-8">
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Contact Us Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage inquiries submitted via the Contact Us form.</p>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by keyword or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors text-sm sm:text-base shadow"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex space-x-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  activeFilter === filter
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{filter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Contact Table */}
          <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Sender</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Subject</th>
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
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}
                        >
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#618170]">{contact.receivedDate}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(index)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </button>
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

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default ContactUsManagement