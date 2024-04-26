import { useState, Fragment, useRef, forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './NewClientDialog.module.scss';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Grid,Dialog, DialogTitle, DialogContent, DialogActions, IconButton , Stack, Input, Badge, 
Radio, RadioGroup, FormControlLabel, Slide} from '@mui/material';
import { LocalizationProvider , DesktopDatePicker} from '@mui/x-date-pickers';
import { Close, PhotoCamera } from '@mui/icons-material';
import avt from '../../assets/images/avt.jpg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
const cx = classNames.bind(styles);
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
        maxWidth={'md'}
        
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
                <Grid item xs={5} sx={{fontSize:'14px'}}>
                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Mã khách hàng</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} size='small'/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Tên khách hàng</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} size='small'/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Điện thoại</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} placeholder='Ví dụ:0869370492' size='small'/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Ngày sinh</p>
                    </Grid>
                    <Grid item xs={8}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} size="small" >
                          <DesktopDatePicker size="small" 
                          sx={{'input':{fontSize:'14px'}, 'svg':{fontSize:'20px'}}}
                          slotProps={{textField:{size:'small', fullWidth:true, variant:'standard'}}}
                           format='DD/MM/YY' placeholder="Ngày/Tháng/Năm"/>
                      </LocalizationProvider>
                    </Grid>
                  </Grid>

                </Grid>
                <Grid item xs={5}>
                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Địa chỉ</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true}  size='small'/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Giới tính</p>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        sx={{display:'flex', flexDirection:'row'}}
                        
                      >
                        <FormControlLabel value="0" control={<Radio  size="small"/>} label="Nam"  sx={{'.MuiFormControlLabel-label':{fontSize:'14px'}}}/>
                        <FormControlLabel value="1" control={<Radio size="small"/>} label="Nữ" sx={{'.MuiFormControlLabel-label':{fontSize:'14px'}}}/>
                      </RadioGroup>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Email</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true}  size='small'/>
                    </Grid>
                  </Grid>
                </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCloseClientDialog} variant="contained" color="primary" size="small">
            Lưu
          </Button>
          <Button autoFocus onClick={onCloseClientDialog} variant="outlined" color="primary" size="small">
            Bỏ qua
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
}