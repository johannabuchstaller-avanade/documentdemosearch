import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';

const FileUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    if (event.target.files) {
      setLoading(true);
      await handleUpload(event.target.files);
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    const filesArray = Array.from(files);
    const filesBase64 = await Promise.all(filesArray.map(async (file) => {
      const base64 = await convertBase64(file);
      return { filename: file.name, base64 };
    }));

    try {
      await axios.post("/api/x", { files: filesBase64 });
      setSelectedFiles(null); // Clear the selected files after successful upload
    } catch (err) {
      console.error(err);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <input 
        accept="application/pdf"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        {/* <Button variant="contained" color='secondary' component="span" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button> */}
        <LoadingButton disabled={loading}loading={loading} variant="contained" color='secondary' component="span" >
                <span>Upload</span>
        </LoadingButton>
      </label>
      {selectedFiles && (
        <Typography variant="subtitle1">
          {`${selectedFiles.length} file(s) selected`}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
