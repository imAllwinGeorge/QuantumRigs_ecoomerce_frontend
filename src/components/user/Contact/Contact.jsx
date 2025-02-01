const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Get in touch with our team for high-performance computing solutions
          </p>
        </header>

        {/* Contact Card */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
          <div className="space-y-8">
            {/* Email */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Email</h3>
              <p className="text-gray-700">info@quantumrigs.com</p>
            </div>

            {/* Phone */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Phone</h3>
              <p className="text-gray-700">(555) 123-4567</p>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Address</h3>
              <div className="text-gray-700">
                <p>123 Tech Street</p>
                <p>Silicon Valley, CA 94025</p>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Business Hours</h3>
              <div className="text-gray-700">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact