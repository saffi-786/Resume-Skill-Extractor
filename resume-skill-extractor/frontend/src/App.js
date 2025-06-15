import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllResumes();
  }, [searchName, skillFilter]);

  const handleSkillSearch = async () => {
    if (!skillFilter.trim()) {
      alert('Please enter a skill to filter');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/resume/filter?skill=${encodeURIComponent(skillFilter)}`);
      if (res.data.success) {
        setAllResumes(res.data.data);
      } else {
        throw new Error(res.data.message || 'Failed to filter resumes');
      }
    } catch (error) {
      console.error('Error filtering resumes:', error);
      alert('Error filtering resumes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllResumes = async () => {
    const res = await axios.get("http://localhost:5000/api/resume/all");
    setAllResumes(res.data.data);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:5000/api/resume/upload", formData);
    setParsedData(res.data.data);
    fetchAllResumes();
  };

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/api/resume/search?name=${searchName}`);
    setAllResumes(res.data.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resume Parser</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <button
                onClick={handleUpload}
                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Search Resumes</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="flex-1 block w-auto px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
              <button
                onClick={handleSearch}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Search
              </button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by Skills</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="flex-1 block w-auto px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              <button
                onClick={handleSkillSearch}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Resumes</h2>
          <div className="bg-white shadow-lg rounded-lg">
            {allResumes.map((res, i) => (
              <div 
                key={i} 
                className="border-b border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{res.name}</h3>
                    <p className="text-sm text-gray-500">Email: {res.email}</p>
                    <p className="text-sm text-gray-500">Phone: {res.phone}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {res.skills.length} Skills
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {res.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Experience:</p>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      {res.experience.map((exp, idx) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
