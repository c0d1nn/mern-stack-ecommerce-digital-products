import React from "react";
import { ColorRing } from "react-loader-spinner";
import trash from "../assets/logo/trash.svg";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@material-ui/core";

const ArticleTable = ({ articles, setArticles }) => {
  const handleDelete = async (articleId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article/${articleId}`
      );
      toast.warning("Article deleted successfully!");
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== articleId)
      );
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article.");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title ID</TableCell>
            <TableCell>Title EN</TableCell>
            <TableCell>Description ID</TableCell>
            <TableCell>Description EN</TableCell>
            <TableCell>Article Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.titleID}</TableCell>
              <TableCell>{article.titleEN}</TableCell>
              <TableCell>{article.descriptionID}</TableCell>
              <TableCell>{article.descriptionEN}</TableCell>
              <TableCell>{article.articleDate}</TableCell>
              <TableCell>{article.category}</TableCell>
              <TableCell>
                {article.image?.url && (
                  <img
                    src={article.image.url}
                    alt={article.image.name}
                    style={{ width: "100px", height: "60px" }}
                  />
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(article.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArticleTable;
