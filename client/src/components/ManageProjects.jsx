import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    category: "",
    images: [],
  });
  const [message, setMessage] = useState("");

  const vendorData = JSON.parse(localStorage.getItem("vendor"));
  const vendorId = vendorData ? vendorData._id : null;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/vendor/${vendorId}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProject({ ...newProject, images: Array.from(e.target.files) });
  };

  const addProject = async () => {
    if (!newProject.projectName.trim()) {
      alert("Project name cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", newProject.projectName);
    formData.append("description", newProject.description);
    formData.append("category", newProject.category);
    formData.append("vendorId", vendorId);
    newProject.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("http://localhost:5000/api/projects/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewProject({ projectName: "", description: "", category: "", images: [] });
      setMessage("Project added successfully!");
      fetchProjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${vendorId}/${projectId}`);
      setMessage("Project deleted successfully!");
      fetchProjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="container my-4 p-4">
      <h2 className="text-center">Manage Projects</h2>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          className="form-control"
          value={newProject.projectName}
          onChange={handleProjectChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={newProject.description}
          onChange={handleProjectChange}
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          name="category"
          className="form-control"
          value={newProject.category}
          onChange={handleProjectChange}
        />
      </div>
      <div className="form-group">
        <label>Upload Images</label>
        <input
          type="file"
          name="images"
          className="form-control"
          multiple
          onChange={handleImageChange}
        />
      </div>
      <button className="btn btn-success mt-2" onClick={addProject}>
        Add Project
      </button>

      <h3 className="mt-4">Your Projects</h3>
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{project.projectName}</h5>
                <p className="card-text">{project.description}</p>
                <p className="card-text text-muted">{project.category}</p>
                {project.images && project.images.length > 0 && (
                  <div className="row">
                    {project.images.map((img, idx) => (
                      <div className="col-6 mb-2" key={idx}>
                        <img
                          src={`http://localhost:5000/uploads/${img}`}
                          alt={`Project ${idx}`}
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "150px", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
