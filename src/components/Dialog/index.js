import {Fragment, useState} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Input, OutlinedInput, Stack, Box, List, ListItem, TextField, Typography, Select, MenuItem,
 Autocomplete, Link } from '@mui/material';
import { Accessibility, Add, Block, Done, EmojiPeople, Escalator, EscalatorWarning, Mode, Save, Search } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker, DateTimePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';
import DialogSecond from '../DialogSecond';
import NewClientDialog from '../NewClientDialog';

const cx = classNames.bind(styles)
const top100Films = [
    { label: 'Bàn số 1', year: 1994 },
      { label: 'Bàn số 2', year: 1972 },
      { label: 'Bàn số 3', year: 1974 },
      { label: 'Bàn số 4', year: 2008 },
    
    ]
    
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

function CustomizedDialog({onCloseDialog, isOpenDialog}) {
    const [openEmptyTable, setOpenEmptyTable] = useState(false);
    const handleOpenEmptyTableDialog = ()=>setOpenEmptyTable(true);
    const handleCloseEmptyTableDialog = ()=>setOpenEmptyTable(false);
    const [newClientDialog, setNewClientDialog]  = useState(false);
    return ( 
        <Fragment>
            <BootstrapDialog
                onClose={onCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={isOpenDialog}
                fullWidth={true}
                maxWidth="md"
                >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Thêm mới đặt bàn
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={onCloseDialog}
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
                    
                        <Grid spacing={5} container >
                            <Grid item xs={6} >
                                <List sx={{pt:0}}>
                                    <ListItem sx={{marginBottom:'15px', padding:0}} >
                                        <Grid container sx={{display:'flex', alignItems:'center'}}>
                                            <Grid item xs={4}>
                                                <h4 style={{marginRight:'20px', fontWeight:'600'}}>Khách hàng</h4>
                                            </Grid>
                                            <Grid item xs={8} sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <OutlinedInput  size="small" 
                                                sx={{borderRadius:'50px', backgroundColor:'#f5f5f6', paddingLeft:'7px', 
                                                paddingRight:'7px', fontSize:'15px', width:'100%'}} 
                                                startAdornment={<Search color='primary' fontSize='small' sx={{marginRight:'10px'}}/>} 
                                                endAdornment={<IconButton sx={{backgroundColor:"#fff"}} size="small" onClick={()=>setNewClientDialog(true)}><Add fontSize='small'/></IconButton>}
                                                placeholder='Tìm khách hàng' />
                                            </Grid>
                                        </Grid>
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} > 
                                        <Grid container >
                                            <Grid item xs={4}>
                                                <h4  style={{marginRight:'20px', fontWeight:'600'}}>Mã đặt bàn</h4>
                                            </Grid>
                                            <Grid item xs={8} >
                                                <Input fullWidth={true} placeholder='Mã tự động' size='small' sx={{fontSize:'15px'}}/>
                                            </Grid>
                                        </Grid>
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} > 
                                        <Grid container >
                                            <Grid item xs={4}>
                                                <h4  style={{marginRight:'20px', fontWeight:'600'}}>Giờ đến</h4>
                                            </Grid>
                                            <Grid item xs={8} >
                                                <LocalizationProvider dateAdapter={AdapterDayjs} size="small" >
                                                    <DesktopDateTimePicker size="small" 
                                                    sx={{'input':{fontSize:'15px'}, 'svg':{fontSize:'20px'}}}
                                                    slotProps={{textField:{size:'small', fullWidth:true, variant:'standard'}}}
                                                    defaultValue={dayjs(new Date())} format='DD/MM/YY h:m'/>
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}}>
                                        <Grid container sx={{display:'flex', alignItems:'center'}}>
                                            <Grid item xs={4}>
                                                <h4 style={{marginRight:'20px',fontWeight:'600' }}>Thời lượng</h4>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Grid container sx={{display:'flex', justifyContent:'flex-start'}}>
                                                    <Grid item xs={4}>
                                                        <Select defaultValue={'hour'} size="small" sx={{fontSize:"15px", width:'80px', height:'30px'}}>
                                                            <MenuItem value="hour">Giờ</MenuItem>
                                                            <MenuItem value="minute">Phút</MenuItem>
                                                        </Select>
                                                    </Grid>
                                                    <Grid item xs={3} sx={{marginLeft:'10px'}}>
                                                        <Input />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}}> 
                                        <Grid container sx={{display:'flex', alignItems:'center'}}>
                                            <Grid item xs={4}>
                                                <h4 style={{marginRight:'20px',fontWeight:'600' }}>Số khách</h4>
                                            </Grid>
                                            <Grid item xs={8} sx={{display:'flex', flexDirection:'row'}}>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Stack sx={{padding:0}} direction="row" alignItems="center">
                                                            <p htmlFor="" style={{display:'flex', flexDirection:'row', alignItems:'center', marginRight:'5px'}}>
                                                                <EmojiPeople />
                                                                Người lớn
                                                            </p>
                                                            <Input  sx={{width:'40px'}}/>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Stack sx={{padding:'0px'}} direction="row">
                                                            <p htmlFor="" style={{display:'flex', flexDirection:'row', alignItems:'center', marginRight:'5px'}}>
                                                                <EscalatorWarning />
                                                                Trẻ em
                                                            </p>
                                                            <Input sx={{width:'40px'}} />
                                                        </Stack>
                                                    </Grid>

                                                </Grid>
                                               
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={6}>
                                <List sx={{pt:0}}>
                                    <ListItem sx={{marginBottom:"15px", padding:0}} >
                                        <Grid container >
                                            <Grid item xs={4}>
                                                <h4 style={{marginRight:'20px',fontWeight:'600', marginTop:'5px' }}>Phòng/Bàn</h4>
                                            </Grid>
                                            <Grid item xs={8}  sx={{display:'flex', flexDirection:'column' ,alignItems:'flex-end'}}>
                                                <Autocomplete multiple options={top100Films} getOptionLabel={(option)=>option.label}
                                                renderInput={(params)=><TextField {...params} variant="filled" size='small' 
                                                sx={{'input':{padding:0}, '.MuiInputBase-root':{backgroundColor:'transparent'}, width:'100%', 
                                                '.MuiFormLabel-root':{fontSize:'15px'}}}/>}
                                                size='small' sx={{width:'100%', '.MuiInputBase-root':{padding:'0px'},  marginBottom:'10px'}}/>

                                                 <Link component="button" variant="body2" fontSize={"12px"} sx={{textDecoration:'none'}}
                                                 onClick={handleOpenEmptyTableDialog} >Xem bàn trống
                                                 </Link>
                                            </Grid>
                                        </Grid>
                                       
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} >
                                       <Input sx={{width:'100%', fontSize:'15px'}} placeholder='Ghi chú' 
                                       startAdornment={<Mode fontSize='small' sx={{marginRight:'10px', color:'#85888c'}} />} size='small'/>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                       

                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={onCloseDialog} variant='contained' fontSize="15px" size='small' 
                    sx={{display:'flex', alignItems:'center'}}>
                        <Save fontSize='small' sx={{marginRight:'5px'}}/>
                        <p style={{marginTop:'3px'}}>chọn</p>
                    </Button>
                    <Button autoFocus onClick={onCloseDialog} variant='outlined' fontSize="15px" size="small">
                        <Block fontSize='small' sx={{marginRight:'5px'}}/>
                        <p style={{marginTop:'3px'}}>bỏ qua</p>
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <DialogSecond openDialogSec={openEmptyTable} onCloseDialogSec={handleCloseEmptyTableDialog}/>
            <NewClientDialog openClientDialog={newClientDialog} onCloseClientDialog={()=>setNewClientDialog(false)}/>
        </Fragment>
     );
}

export default CustomizedDialog;