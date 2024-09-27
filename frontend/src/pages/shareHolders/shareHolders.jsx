import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { toast } from "react-toastify";
import axios from "axios";

const ShareHolders = () => {
  const [shareholders, setShareholders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    numberOfShares: "",
    percentage: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchShareholders();
  }, []);

  const fetchShareholders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/shareholder`
      );
      setShareholders(response.data);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch shareholders");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/shareholder/${selectedId}`,
          formData
        );
        toast.success("Shareholder updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/shareholder`,
          formData
        );
        toast.success("Shareholder created successfully");
      }
      fetchShareholders();
      resetForm();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to submit shareholder data");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", numberOfShares: "", percentage: "" });
    setEditMode(false);
    setSelectedId(null);
  };

  const handleEdit = (shareholder) => {
    setFormData({
      name: shareholder.name,
      numberOfShares: shareholder.numberOfShares,
      percentage: shareholder.percentage,
    });
    setEditMode(true);
    setSelectedId(shareholder._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/shareholder/${id}`
      );
      toast.success("Shareholder deleted successfully");
      fetchShareholders();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to delete shareholder");
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <>
      <Navbar />
      <section className="container module-header">
        <div className="header-root my-4">
          <h2>SHAREHOLDERS</h2>
        </div>
        <Accordion>
          <AccordionSummary
            id="panel1-header"
            aria-controls="panel1-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">
              {editMode ? "Edit Shareholder" : "Create Shareholder"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="div">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="numberOfShares" className="form-label">
                    Number of Shares
                  </label>
                  <input
                    type="text"
                    name="numberOfShares"
                    className="form-control"
                    value={formData.numberOfShares}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="percentage" className="form-label">
                    Percentage
                  </label>
                  <input
                    type="text"
                    name="percentage"
                    className="form-control"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Update" : "Create"}
                  </button>
                  {editMode && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            id="panel1-header"
            aria-controls="panel1-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Shareholder List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <h3>Shareholder List</h3>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Number of Shares</th>
                    <th>Percentage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shareholders.map((shareholder) => (
                    <tr key={shareholder._id}>
                      <td>{shareholder.name}</td>
                      <td>{formatNumber(shareholder.numberOfShares)}</td>
                      <td>{shareholder.percentage} %</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(shareholder)}
                        >
                          Edit
                        </button>
                        {/* <button
                    className="btn btn-primary ms-2"
                    onClick={() => handleDelete(shareholder._id)}
                  >
                    Delete
                  </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionDetails>
        </Accordion>
      </section>
    </>
  );
};

export default ShareHolders;
