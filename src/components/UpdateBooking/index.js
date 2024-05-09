import {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Input, Stack, List, ListItem, TextField, Select, MenuItem,
 Autocomplete, Link, Backdrop, CircularProgress} from '@mui/material';
import {Add, Block, DeleteOutlineOutlined, EmojiPeople, EscalatorWarning, Mode, Save, Search } from '@mui/icons-material';
import { LocalizationProvider, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import DialogSecond from '../DialogSecond';
import NewClientDialog from '../NewClientDialog';
import CustomAlert from '../CustomAlert';
import { parse } from 'date-fns';
import { useStore, actions } from '../../store';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

function CustomizedDialog({onCloseDialog, isOpenDialog , data}) {
    const [state, dispatch] = useStore();
    const [openEmptyTable, setOpenEmptyTable] = useState(false);
    const handleOpenEmptyTableDialog = ()=>setOpenEmptyTable(true);
    const handleCloseEmptyTableDialog = ()=>setOpenEmptyTable(false);
    const [newClientDialog, setNewClientDialog]  = useState(false);
    const [listTable ,setListTable] = useState([]);
    const [dataSelectedId, setDataSelectedId] = useState([]);
    const [searchClient, setSearchClient] = useState('');
    const [listClientResult, setListClientResult] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState(false);
    const [isLoading, setLoading]= useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({});
    const [dateTimeFormat, setDateTimeFormat] = useState(()=>{
        return parse(`${data.booking_date} ${data.booking_time}`, 'yyyy-MM-dd HH:mm:ss', new Date());
    })
    const [newBooking, setNewBooking] = useState({
        client_id:data.client_id, 
        booking_code:data.booking_code, 
        booking_date: data.booking_date, 
        booking_time:data.booking_time, 
        period_time:data.period_time, 
        time_unit:data.time_unit, 
        adult_quantity:data.adult_quantity, 
        children_quantity: data.children_quantity, 
        tables: data.table_id !== null ? data.table.map((tableItem, index)=>({id:data.table_id[index], name: tableItem.name, status: tableItem.status})) : [], 
        booking_note:data.booking_note
    })
    useEffect(()=>{
        axios.get(`http://localhost:4049/api/table`)
        .then(response=>setListTable(response.data.map(data=>({id: data.id,name: data.name, status:data.status}))))
    }, [])
    const handleDeleteBooking = async ()=>
        {
            try 
            {
                const result = await axios.delete(`http://localhost:4049/api/booking/delete`, {data:{booking_code: data.booking_code}});
                const newListBooking = await axios.get('http://localhost:4049/api/booking');
                if(result.data.status === 'success')
                    dispatch(actions.setListBooking(newListBooking.data));
                setAlertMessage({status:result.data.status, message: result.data.message});
                setShowAlert(true);
            }
            catch(error)
            {
                setAlertMessage({status:'error', message: error.message});
                setShowAlert(true);
            }
            finally
            {
                setTimeout(()=>
                {
                    setLoading(false)
                    onCloseDialog();
                }, 1000)
            }
            
        }
    const handleUpdateBooking = async ()=>
    {
        try 
        {
            console.log(newBooking);
            const result = await axios.put(`http://localhost:4049/api/booking/update`, newBooking);
            const newListBooking = await axios.get('http://localhost:4049/api/booking');
            if(result.data.status === 'success')
                dispatch(actions.setListBooking(newListBooking.data));
            setAlertMessage({status:result.data.status, message: result.data.message});
            setShowAlert(true);
        }
        catch(error)
        {
            setAlertMessage({status:'error', message: error.message});
            setShowAlert(true);
        }
        finally
        {
            setTimeout(()=>
            {
                setLoading(false)
                onCloseDialog();
            }, 1000)
        }
        
    }
    var timeout;
    useEffect(()=>{
        if(searchClient !== '')
        {
            timeout = setTimeout(()=>{
                axios.get(`http://localhost:4049/api/client?name=${searchClient}`)
                .then(response=>{
                    setListClientResult(response.data);
                    setOpenSearchResult(true);
                })
            }, 500)
        }
        else 
        {
            setOpenSearchResult(false);
            setListClientResult([]);
        }
        return ()=> clearTimeout(timeout);
    }, [searchClient])
    const handleChangeInput = (name, value)=>
        {
            setOpenSearchResult(false);
            setSearchClient('');
           if(name ==='booking_date')
            {
                var booking_date = `${value.$y}-${("0" + (value.$M + 1)).slice(-2)}-${("0" + value.$D).slice(-2)}`;
                var booking_time = `${("0" + value.$H).slice(-2)}:${("0" + value.$m).slice(-2)}:00`;
                setNewBooking(prevValue=>({...prevValue, booking_date,booking_time }))
            }
            else 
                setNewBooking(prevValue=>({...prevValue, [name]:value}))
            if(name === 'tables')
            {
                if(value.length >0)
                    setDataSelectedId(value.map(data=>({id:data.id, name:data.name})));
                else 
                    setDataSelectedId([]);
            }
        }

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
                    {data.full_name}
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
                                                <Autocomplete  options={listClientResult} 
                                                defaultValue={{ full_name: data.full_name, client_code: data.client_code }} 
                                                getOptionLabel={(option)=>`${option.full_name} - ${option.client_code}`}
                                                open={openSearchResult}
                                                renderInput={(params)=>(
                                                    <Stack direction="row" alignItems="flex-end" >
                                                        <Search color='primary' fontSize='small' sx={{marginRight:'10px'}}/>
                                                        <TextField {...params} variant="filled" size='small' name='tables'
                                                        sx={{'input':{padding:0}, '.MuiInputBase-root':{backgroundColor:'transparent'}, width:'100%', 
                                                        'input':{fontSize:'14px'}}} placeholder='Tìm khách hàng'
                                                        onInput={(e)=>setSearchClient(e.target.value)} value={data.full_name}/>
                                                        <IconButton sx={{backgroundColor:"#fff"}} size="small" onClick={()=>setNewClientDialog(true)}><Add fontSize='small'/></IconButton>
                                                    </Stack>
                                                )}
                                                size='small' sx={{width:'100%', '.MuiInputBase-root':{padding:'2px'},  marginBottom:'10px', fontSize:'14px'}} 
                                                onChange={(event, value)=>{
                                                    var clientId;
                                                    if(value !== null)
                                                        clientId = value.id;
                                                    else 
                                                        clientId = '';
                                                    handleChangeInput('client_id',clientId)
                                                }} 
                                                />
                                            </Grid>
                                        </Grid>
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} > 
                                        <Grid container >
                                            <Grid item xs={4}>
                                                <h4  style={{marginRight:'20px', fontWeight:'600'}}>Mã đặt bàn</h4>
                                            </Grid>
                                            <Grid item xs={8} >
                                                <Input fullWidth={true} placeholder='Mã tự động' size='small' sx={{fontSize:'14px'}}
                                                name='booking_code' readOnly value={data.booking_code}/>
                                            </Grid>
                                        </Grid>
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} > 
                                        <Grid container >
                                            <Grid item xs={4}>
                                                <h4  style={{marginRight:'20px', fontWeight:'600'}}>Giờ đến</h4>
                                            </Grid>
                                            <Grid item xs={8} >
                                                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                                    <DesktopDateTimePicker size="small" 
                                                    sx={{'input':{fontSize:'14px'}, 'svg':{fontSize:'20px'}}}
                                                    slotProps={{textField:{size:'small', fullWidth:true, variant:'standard'}}}
                                                    format='DD/MM/YY h:m' onChange={(value)=>handleChangeInput('booking_date', value)}
                                                    value={dayjs(dateTimeFormat)}/>
                                                   
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
                                                        <Select defaultValue={data.time_unit} size="small" sx={{fontSize:"14px", width:'80px', height:'30px'}} 
                                                        onChange={(e)=>handleChangeInput(e.target.name, e.target.value)} name='time_unit'>
                                                            <MenuItem value="giờ" sx={{fontSize:14}}>Giờ</MenuItem>
                                                            <MenuItem value="phút"  sx={{fontSize:14}}>Phút</MenuItem>
                                                        </Select>
                                                    </Grid>
                                                    <Grid item xs={3} sx={{marginLeft:'10px'}}>
                                                        <Input name='period_time' onChange={e=>handleChangeInput(e.target.name, e.target.value)} sx={{fontSize:14}}
                                                        defaultValue={data.period_time}/>
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
                                                            <Input  sx={{width:'40px', fontSize:14}} name='adult_quantity' onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}
                                                            defaultValue={data.adult_quantity}/>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Stack sx={{padding:'0px'}} direction="row">
                                                            <p htmlFor="" style={{display:'flex', flexDirection:'row', alignItems:'center', marginRight:'5px'}}>
                                                                <EscalatorWarning />
                                                                Trẻ em
                                                            </p>
                                                            <Input sx={{width:'40px', fontSize:14}} name="children_quantity" onChange={(e)=>handleChangeInput(e.target.name, e.target.value)}
                                                            defaultValue={data.children_quantity}/>
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
                                                <Autocomplete multiple  options={listTable} getOptionLabel={(option)=>`${option.name} - ${option.status ===1 ? 'đã sử dụng' : 'trống'}`}
                                                value={newBooking.tables} getOptionDisabled={(option)=>option.status ===1 }
                                                renderInput={(params)=><TextField {...params} variant="filled" size='small' name='tables'
                                                sx={{'input':{padding:0}, '.MuiInputBase-root':{backgroundColor:'transparent'}, width:'100%', 
                                                '.MuiFormLabel-root':{fontSize:'14px'}}} />}
                                                size='small' sx={{width:'100%', '.MuiInputBase-root':{padding:'0px'},  marginBottom:'10px'}} 
                                                onChange={(event, value)=>handleChangeInput('tables', value)} />
                                                 <Link component="button" variant="body2" fontSize={"12px"} sx={{textDecoration:'none'}}
                                                 onClick={handleOpenEmptyTableDialog} >Xem bàn trống
                                                 </Link>
                                            </Grid>
                                        </Grid>
                                       
                                    </ListItem>

                                    <ListItem sx={{marginBottom:"15px", padding:0}} >
                                       <Input sx={{width:'100%', fontSize:'14px'}} placeholder='Ghi chú' 
                                       startAdornment={<Mode fontSize='small' sx={{marginRight:'10px', color:'#85888c'}} />} size='small'
                                       name='booking_note' onChange={(e)=>handleChangeInput(e.target.name,e.target.value )}
                                       defaultValue={data.booking_note}/>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                       

                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleDeleteBooking} variant='contained' fontSize="15px" size='small' color='error'
                        sx={{display:'flex', alignItems:'center'}}>
                        <DeleteOutlineOutlined fontSize='small' sx={{marginRight:'5px'}}/>
                        <p style={{marginTop:'3px'}}>Xóa</p>
                    </Button>
                    <Button autoFocus onClick={handleUpdateBooking} variant='contained' fontSize="15px" size='small' 
                    sx={{display:'flex', alignItems:'center'}}>
                        <Save fontSize='small' sx={{marginRight:'5px'}}/>
                        <p style={{marginTop:'3px'}}>Cập nhập</p>
                    </Button>
                    <Button autoFocus onClick={onCloseDialog} variant='outlined' fontSize="15px" size="small">
                        <Block fontSize='small' sx={{marginRight:'5px'}}/>
                        <p style={{marginTop:'3px'}}>bỏ qua</p>
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <DialogSecond openDialogSec={openEmptyTable} onCloseDialogSec={handleCloseEmptyTableDialog} dataSelectedId={dataSelectedId}
            onChangeInput={handleChangeInput}/>
            <NewClientDialog openClientDialog={newClientDialog} onCloseClientDialog={()=>setNewClientDialog(false)}/>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
            open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
        </Fragment>
     );
}

export default CustomizedDialog;