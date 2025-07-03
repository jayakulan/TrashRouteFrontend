import { useState } from "react"
import { Link } from "react-router-dom"
import { Diamond, Search, Bell } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const ManageCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const customers = [
    {
      id: 1,
      name: "Sophia Bennett",
      email: "sophia.bennett@example.com",
      contact: "+1-555-123-4567",
      status: "Active",
    },
    {
      id: 2,
      name: "Ethan Carter",
      email: "ethan.carter@example.com",
      contact: "+1-555-987-6543",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      contact: "+1-555-246-8013",
      status: "Active",
    },
    {
      id: 4,
      name: "Liam Foster",
      email: "liam.foster@example.com",
      contact: "+1-555-369-1215",
      status: "Active",
    },
    {
      id: 5,
      name: "Ava Green",
      email: "ava.green@example.com",
      contact: "+1-555-482-3457",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Noah Harris",
      email: "noah.harris@example.com",
      contact: "+1-555-605-7890",
      status: "Active",
    },
    {
      id: 7,
      name: "Isabella Jones",
      email: "isabella.jones@example.com",
      contact: "+1-555-728-0246",
      status: "Active",
    },
    {
      id: 8,
      name: "Jackson King",
      email: "jackson.king@example.com",
      contact: "+1-555-841-5678",
      status: "Inactive",
    },
    {
      id: 9,
      name: "Mia Lewis",
      email: "mia.lewis@example.com",
      contact: "+1-555-964-9012",
      status: "Active",
    },
    {
      id: 10,
      name: "Lucas Martin",
      email: "lucas.martin@example.com",
      contact: "+1-555-087-2345",
      status: "Active",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.includes(searchQuery),
  )

  const handleAddCustomer = () => {
    console.log("Add customer clicked")
    // Handle add customer logic
  }

  const handleViewProfile = (customerId) => {
    console.log("View profile for customer:", customerId)
    // Handle view profile logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
              <span className="text-xl font-bold text-gray-900">TrashRoute</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-blue-600 font-medium">
                Users
              </Link>
              <Link to="/admin/companies" className="text-gray-700 hover:text-gray-900 font-medium">
                Companies
              </Link>
              <Link to="/admin/requests" className="text-gray-700 hover:text-gray-900 font-medium">
                Requests
              </Link>
              <Link to="/admin/feedback" className="text-gray-700 hover:text-gray-900 font-medium">
                Feedback
              </Link>
              <Link to="/admin/reports" className="text-gray-700 hover:text-gray-900 font-medium">
                Reports
              </Link>
              <UserProfileDropdown />
            </div>

            {/* Right side - Notification and Avatar */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=orange&color=fff&size=32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Customers</h1>
          <button
            onClick={handleAddCustomer}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Customer
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.contact}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewProfile(customer.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found matching your search.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </main>
    </div>
  )
}

export default ManageCustomers