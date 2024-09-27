import React, { useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import uploadToCloud from "./assets/uploading-to-cloud.gif";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isUploadSuccessfull, setIsUploadSuccessfull] = useState(false);

  const fileInputRef = useRef(null);
  const BACKEND_BASE_URL = "http://localhost:4004"
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      setFileType(newFile.type.split("/")[0]);
      const fileUrl = URL.createObjectURL(newFile);
      setPreviewUrl(fileUrl);
    }
  };

  const showFilePreview = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={previewUrl}
            alt="preview"
            width="400"
            className="file-preview"
          />
        );
      case "video":
        return (
          <video
            src={previewUrl}
            controls
            width="400"
            className="file-preview"
          />
        );
      case "audio":
        return <audio src={previewUrl} controls className="file-preview" />;
      case "application":
        if (file.type === "application/pdf") {
          return (
            <embed
              src={previewUrl}
              width="400"
              height="400"
              className="file-preview"
            />
          );
        }
        break;
      default:
        return <p>File type not supported for preview.</p>;
    }
  };

  const handleFileUpload = async () => {
    setIsLoader(true);
    const formData = new FormData();
    formData.append("file", file);
    setFile(null);
    setPreviewUrl("");
    setFileType("");
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}/upload`, formData);
      console.log(res.data);
      setIsUploadSuccessfull(true);
      setTimeout(() => {
        setIsUploadSuccessfull(false);
      },3000);
    } catch (err) {
      console.error(err);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsLoader(false);
  };

  return (
    <Box className="web-app">
      <Typography variant="h1" className="website-name">
        File uploader
      </Typography>
      <input
        type="file"
        onChange={handleFileChange}
        className="choose-file-input"
        ref={fileInputRef}
      />
      {file && (
        <Box className="preview-container">
          <Box>
            <Typography variant="h4" className="file-preview-header">
              File Preview:
            </Typography>
          </Box>
          <Box>{showFilePreview()}</Box>
          <Box>
            <Button onClick={handleFileUpload} className="upload-button">
              Upload File
            </Button>
          </Box>
        </Box>
      )}
      {isUploadSuccessfull && (
        <Typography
          className="successfull-upload-text"
        >
          File Uploaded Successfully
        </Typography>
      )}
      <Box className="cloud-uploading-gif">
        {isLoader && <img src={uploadToCloud} alt="upload-gif" width="200" />}
      </Box>
    </Box>
  );
}

export default App;
