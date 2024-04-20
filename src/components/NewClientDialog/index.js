import { useState, Fragment, useRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Grid,Dialog, DialogTitle, DialogContent, DialogActions, IconButton , Stack, ImageListItem, Input, InputLabel, Badge} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import avt from '../../images/avt.jpg';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function NewClientDialog({openClientDialog, onCloseClientDialog}) {
  const [open, setOpen] = useState(false);
  const [isUploadImage, setIsUploadImage]  =  useState(false);
  const [imgURL, setImgUrl] = useState(null);
  const uploadInputRef = useRef();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleUploadImage = (e)=>
  {
    console.log('upload');
     const file = e.target.files[0];
     if(file)
     {
         const imgURL = URL.createObjectURL(file);
         setIsUploadImage(true);
         setImgUrl(imgURL);
    }
  }
  const handleCancelImage = ()=>{
    uploadInputRef.current.value = "";
    setIsUploadImage(false)
    setImgUrl(null);
  }
  
  return (
    <Fragment>
      <BootstrapDialog
        onClose={onCloseClientDialog}
        aria-labelledby="customized-dialog-title"
        open={openClientDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thêm khách hàng
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onCloseClientDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
                <Grid item xs={2} sx={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
                    <div style={{position:'relative'}}>
                        {!isUploadImage ?
                         <Stack justifyContent="center" alignItems="center" sx={{border:'1px dashed black', borderRadius:'10px', padding:'40px', width:'100%'}}>
                            <PhotoCamera sx={{fontSize:'40px'}}/>
                        </Stack>
                        : 
                        <Badge badgeContent={'x'} color='primary' onClick={handleCancelImage}>
                            <img src={imgURL} loading='lazy' style={{width:'100%', height:'100%', borderRadius:'10px'}}/>
                        </Badge>
                        }
                    </div>
                    <label htmlFor="uploadImage" style={{marginTop:'5px', backgroundColor:'#f2f2f2', color:'#0066CC', padding:'5px 10px', borderRadius:'10px'}}>
                        <input hidden type="file" id="uploadImage" onChange={handleUploadImage} accept="image/*" ref={uploadInputRef}/>
                        <span>Chọn ảnh</span>
                    </label>
                    
                </Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={5}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCloseClientDialog}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
}