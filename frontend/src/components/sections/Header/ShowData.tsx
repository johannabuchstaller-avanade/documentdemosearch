import React, { useState } from 'react';
import { useCallback, ChangeEvent, DragEvent } from 'react';
import { Chip, LinearProgress, Stack } from '@mui/material';
import { Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';


import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}





const ShowData: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(prevState => [...prevState, ...Array.from(files)]);
    }
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleUpload = async () => {
    const filesBase64 = await Promise.all(selectedFiles.map(async (file) => {
      const base64 = await convertBase64(file);
      return { filename: file.name, base64 };
    }));

    filesBase64.forEach(async (file) => {
      try {
        // https://wedocumentsearchdemocaseapi.azurewebsites.net/api/upload
        // https://function-msfnex54-05-ai-data-parcing-prd.azurewebsites.net/api/upload
        const response = await axios.post("https://function-msfnex54-05-ai-data-parcing-prd.azurewebsites.net/api/upload", { files: [file] }, {
          onUploadProgress: progressEvent => {
            if (progressEvent.total) {
              const uploadPercentage = Math.floor((progressEvent.loaded / (progressEvent.total) * 100));
              setUploadProgress({ ...uploadProgress, [file.filename]: uploadPercentage });
            }
          }
        });
    
        // Clear the selected file from the state after successful upload
        if (response.status === 200) {
          setSelectedFiles(prevFiles => prevFiles.filter(prevFile => prevFile.name !== file.filename));
        }
      } catch (err) {
        console.error(err);
      }
    });
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

  const preventDefaults = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  

  const highlight = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add('highlight');
  };

  const unhighlight = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('highlight');
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button variant="contained" onClick={handleOpen} color='secondary'>
        Upload Files
      </Button>

      <BootstrapDialog
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Upload Files
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <div
          onDrop={onDrop}
          onDragOver={preventDefaults}
          onDragEnter={highlight}
          onDragLeave={unhighlight}
          onDragEnd={unhighlight}
          style={{
            border: '2px dashed grey',
            padding: '2em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2em',
            minHeight: '100px',
          }}
        >
          <Typography variant="body2">Drag and drop your files here, or click to select files</Typography>
          <Button variant="contained" component="label">
            Select Files
            <input
              type="file"
              hidden
              multiple
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(event.target.files)}
            />
          </Button>
        </div>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {selectedFiles.map((file, index) => (
            <ListItem key={index}>
              
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Chip label={file.name} onDelete={() => setSelectedFiles(prevState => prevState.filter(prevFile => prevFile.name !== file.name))} />
                <LinearProgress variant="determinate" value={uploadProgress[file.name] || 0} />
              </Box>
            </ListItem>
          ))}
        </List>
        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button
            
            variant="contained"
            color="secondary"
            disabled={selectedFiles.length === 0}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Stack>
      </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

export default ShowData;
