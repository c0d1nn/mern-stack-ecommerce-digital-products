import React, { useState, useEffect } from "react";
import "./article-style.css";
import Navbar from "../../component/Navbar/navbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { toast } from "react-toastify";
import trash from "../../assets/logo/trash.svg";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

const Article = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [imageCover, setImageCover] = useState("");

  const [articles, setArticles] = useState([]);
  const [titleID, setTitleID] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionID, setDescriptionID] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [articleDate, setArticleDate] = useState("");
  const [category, setCategory] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Token not found");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log("Fetched Articles:", response.data);
        setArticles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching articles:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized! Please login again.");
        }
      });
  }, [token]);

  const handleRadioChange = (e) => {
    setCategory(e.target.value);
    // console.log("Category selected:", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titleID", titleID);
    formData.append("titleEN", titleEN);
    formData.append("descriptionID", descriptionID);
    formData.append("descriptionEN", descriptionEN);
    formData.append("articleDate", articleDate);
    formData.append("category", category);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    formData.append("createdAt", new Date().toISOString());

    // console.log("Submitting form data:", formData);
    const token = sessionStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Article added successfully!");

      setTitleID("");
      setTitleEN("");
      setDescriptionID("");
      setDescriptionEN("");
      setArticleDate("");
      setCategory("");
      setSelectedFile(null);
      setImageCover("");

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Failed to add article.");
    }
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setImageCover("");
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      setImageCover("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile(e.target.files[0]);
      setImageCover(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDelete = async (articleId) => {
    try {
      if (!articleId) {
        alert("Select an article to delete first.");
        return;
      }
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article?"
      );
      if (!confirmDelete) {
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}${articleId}`
      );
      console.log("Article deleted successfully!");
      toast.warning("Article deleted successfully!");
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article`
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error deleting article:", error);
      if (error.response && error.response.status === 500) {
        window.location.reload();
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <section className="container module-header">
        <div className="header-root">
          <h2>ARTICLE CONTROL</h2>
        </div>
        <Accordion>
          <AccordionSummary
            id="panel1-header"
            aria-controls="panel1-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Create New Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form action="" onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label
                    htmlFor="titleID"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Title ID
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="titleID"
                      placeholder="e.g: Perusahaan Pigijo"
                      onChange={(e) => setTitleID(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="titleEN"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Title EN
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="titleEN"
                      placeholder="e.g: Perusahaan Pigijo"
                      onChange={(e) => setTitleEN(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="descriptionID"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Description ID
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionID"
                      placeholder=""
                      rows="4"
                      onChange={(e) => setDescriptionID(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="descriptionEN"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Description EN
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionEN"
                      placeholder=""
                      rows="4"
                      onChange={(e) => setDescriptionEN(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="articleDate"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Article Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="articleDate"
                      onChange={(e) => setArticleDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="imageUpload"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Image Cover
                  </label>
                  <div className="col-sm-8">
                    {selectedFile ? (
                      <div>
                        <img
                          src={imageCover}
                          alt="Preview"
                          style={{ maxWidth: "320px", height: "180px" }}
                        />
                        <button
                          className="btn btn-danger mt-2 ms-3"
                          onClick={handleDeleteImage}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="imageUpload"
                        onChange={onSelectFile}
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label htmlFor="Category" className="col-sm-4 col-form-label">
                    Category
                  </label>
                  <div className="col-sm-8">
                    <div className="form-check">
                      <input
                        type="radio"
                        value="INTERNAL"
                        id="internal"
                        name="category"
                        className="form-check-input custom-input"
                        onChange={handleRadioChange}
                        checked={category === "INTERNAL"}
                        required
                      />
                      <label htmlFor="internal" className="form-check-label">
                        Internal
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        value="PUBLIC"
                        id="public"
                        name="category"
                        className="form-check-input custom-input"
                        onChange={handleRadioChange}
                        checked={category === "PUBLIC"}
                      />
                      <label htmlFor="public" className="form-check-label">
                        Public
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor=""
                    className="col-sm-4 col-form-label text-right"
                  ></label>
                  <div className="col-sm-8">
                    <button className="btn btn-primary text-light btn-md px-3">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            id="panelDataTable-header"
            aria-controls="panelDataTable-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Data Table</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <td>Title ID</td>
                      <td>Title EN</td>
                      <td>Description ID</td>
                      <td>Description EN</td>
                      <td>Article Date</td>
                      <td>Category</td>
                      <td>Image</td>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => {
                      return (
                        <tr key={article._id}>
                          <td>{article.titleEN}</td>
                          <td>{article.titleID}</td>
                          <td>{article.descriptionID}</td>
                          <td>{article.descriptionEN}</td>
                          <td>{formatDate(article.articleDate)}</td>
                          <td>{article.category}</td>
                          <td>
                            {article.image?.url && (
                              <img
                                src={article.image.url}
                                alt={article.image.name}
                                style={{ maxWidth: "100%", height: "60px" }}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </section>
    </>
  );
};

export default Article;
