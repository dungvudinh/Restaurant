import { useState, Fragment, useRef, forwardRef, useEffect, memo } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './NewClientDialog.module.scss';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Grid,Dialog, DialogTitle, DialogContent, DialogActions, IconButton , Stack, Input, Badge, 
Radio, RadioGroup, FormControlLabel,Backdrop, CircularProgress} from '@mui/material';
import { LocalizationProvider , DesktopDatePicker} from '@mui/x-date-pickers';
import { PhotoCamera } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CustomAlert from '../CustomAlert';
const cx = classNames.bind(styles);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
function generateRandomCode(id) {
  let prefix = "KH"; // Tiền tố cho mã hóa đơn
  let invoiceCode = String(id).padStart(6, '0');
  return `KH${invoiceCode}`;
}

function NewClientDialog({openClientDialog, onCloseClientDialog}) {
  const [isUploadImage, setIsUploadImage]  =  useState(false);
  const [imgURL, setImgUrl] = useState(null);
  // const [clientCode, setClientCode] = useState('');
  const [isLoading, setLoading]= useState(false);
  const [isDisableBtn, setDisableBtn]= useState(true)
  const [alertMessage, setAlertMessage] = useState({status:'', message:''});
  const [showAlert, setShowAlert] = useState(false);
  const [clientCode, setClientCode] = useState(null);
  const [infoClient, setInfoClient] = useState({
    file: null, 
    client_code: '', 
    client_name: '', 
    phone_number: '', 
    birth_date: '', 
    address: '', 
    gender:null,
    email:''
  })
  const uploadInputRef = useRef();
  useEffect(()=>{
    axios.get('http://localhost:4049/api/client/last_id')
    .then((res)=>{
      setClientCode(generateRandomCode(res.data.id))
    })
  }, [])
  useEffect(()=>{
    if(clientCode !== null)
        setInfoClient(prev=>({...prev, 'client_code' : clientCode}))
  }, [clientCode])
  
  useEffect(()=>{
    if(infoClient.client_name === '' || infoClient.phone_number === '')
      setDisableBtn(true);
    else 
      setDisableBtn(false);
  }, [infoClient.client_name, infoClient.phone_number])
  
  const handleUploadImage = (e)=>
  {
     const file = e.target.files[0];
     if(file)
     {
         const imgURL = URL.createObjectURL(file);
         setInfoClient(prev=>({...prev, 'file': file}))
         setIsUploadImage(true);
         setImgUrl(imgURL);
    }
  }
  const handleCancelImage = ()=>{
    uploadInputRef.current.value = "";
    setInfoClient(prev=>({...prev, 'file' : null}))
    setIsUploadImage(false)
    setImgUrl(null);
  }
  const handleChangeInput =(name, value)=>
    {
        if(name ==='birth_date')
        {
            var birth_date = `${value.$y}-${("0" + (value.$M + 1)).slice(-2)}-${("0" + value.$D).slice(-2)}`;
            setInfoClient(prevValue=>({...prevValue, birth_date }))
        }
        else 
          setInfoClient(prev=>({...prev, [name]: value}))
        
    }
  const handleSubmitNewClient = async ()=>
    {
      setLoading(true);
      const formData = new FormData();
      formData.append('img_path', infoClient.file);
      formData.append('client_code', infoClient.client_code);
      formData.append('client_name', infoClient.client_name);
      formData.append('phone_number', infoClient.phone_number);
      formData.append('birth_date', infoClient.birth_date);
      formData.append('address', infoClient.address);
      formData.append('gender', infoClient.gender);
      formData.append('email', infoClient.email);

      try 
      {
        var result  = await axios.post('http://localhost:4049/api/client/new', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          setAlertMessage({status:result.data.status, message: result.data.message});
          setShowAlert(true);
      }
      catch(error)
      {
        setAlertMessage({status:'error', message: error.mxessage});
        setShowAlert(true);
      }
      finally{
        setLoading(false)
        onCloseClientDialog();
      }
      // onCloseClientDialog
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
                        <input hidden type="file" id="uploadImage" onChange={handleUploadImage} accept="image/*" ref={uploadInputRef} />
                        <span>Chọn ảnh</span>
                    </label>
                    
                </Grid>
                <Grid item xs={5} sx={{fontSize:'14px'}}>
                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Mã khách hàng</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} size='small' value={clientCode} readOnly/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Tên khách hàng</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} size='small' name="client_name" onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Điện thoại</p>
                    </Grid>
                    <Grid item xs={8}>
                      <Input fullWidth={true} placeholder='Ví dụ:0869370492' size='small' name='phone_number'  type='number'
                      onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}} >Ngày sinh</p>
                    </Grid>
                    <Grid item xs={8}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} size="small" >
                          <DesktopDatePicker size="small" 
                          sx={{'input':{fontSize:'14px'}, 'svg':{fontSize:'20px'}}}
                          slotProps={{textField:{size:'small', fullWidth:true, variant:'standard'}}}
                           format='DD/MM/YY' placeholder="Ngày/Tháng/Năm" onChange={(value)=>handleChangeInput('birth_date', value)}/>
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
                      <Input fullWidth={true}  size='small' name="address"  onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}/>
                    </Grid>
                  </Grid>

                  <Grid container className={cx('info-client_item')}>
                    <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                      <p style={{fontWeight:'600'}}>Giới tính</p>
                    </Grid>
                    <Grid item xs={8}>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="gender"
                        sx={{display:'flex', flexDirection:'row'}}
                        
                        onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}
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
                      <Input fullWidth={true}  size='small' name="email" onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}/>
                    </Grid>
                  </Grid>
                </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmitNewClient} variant="contained" color="primary" size="small" disabled={isDisableBtn}>
            Lưu
          </Button>
          <Button autoFocus onClick={onCloseClientDialog} variant="outlined" color="primary" size="small">
            Bỏ qua
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/* {isLoading && <Loading />} */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
      open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
     {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
    </Fragment>
  );
}
export default memo(NewClientDialog);