const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">About QuantumRigs</h1>
          <p className="text-gray-600 text-lg">
            Your trusted partner for high-performance computing solutions
          </p>
        </header>

        {/* About Content */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-md space-y-6">
          {/* Company Overview */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Who We Are</h2>
            <p className="text-gray-700">
              QuantumRigs is a leading provider of cutting-edge high-performance computing solutions. 
              We specialize in designing, building, and optimizing powerful computing systems for 
              research, data analysis, and complex simulations.
            </p>
          </section>

          {/* Our Mission */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Our Mission</h2>
            <p className="text-gray-700">
              Our mission is to empower organizations and researchers with the computational power 
              they need to push the boundaries of science, technology, and innovation. We strive to 
              make high-performance computing accessible, efficient, and sustainable.
            </p>
          </section>

          {/* Our Expertise */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Our Expertise</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Custom HPC cluster design and implementation</li>
              <li>GPU-accelerated computing solutions</li>
              <li>Quantum computing research and development</li>
              <li>Big data analytics infrastructure</li>
              <li>Cloud-based HPC services</li>
            </ul>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Why Choose QuantumRigs</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Industry-leading expertise and experience</li>
              <li>Customized solutions tailored to your needs</li>
              <li>Cutting-edge technology and continuous innovation</li>
              <li>Exceptional customer support and service</li>
              <li>Commitment to sustainability and energy efficiency</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About