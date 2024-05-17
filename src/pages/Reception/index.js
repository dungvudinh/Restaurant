import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import classNames from "classnames/bind";
import styles from './Reception.module.scss';
import Sidebar from "../../components/Sidebar";
import DataTable  from '../../components/DataTable';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import {AccountCircleOutlined, ArrowForward, Check, EditCalendar, EscalatorWarning, FamilyRestroom, LogoutOutlined, NoteAltOutlined, NotificationsActiveOutlined} from '@mui/icons-material';
import {Grid,Box, FormGroup, FormControlLabel, Checkbox, Button, Stack, Menu, MenuItem, Badge, ListItemIcon, ListItemText, Typography, IconButton} from '@mui/material';
import CustomizedDialog from "../../components/Dialog";
import * as XLSX from 'xlsx/xlsx.mjs';
import {saveAs} from 'file-saver'
import{ actions, useStore} from '../../store';
import CustomAlert from "../../components/CustomAlert";
import {io} from 'socket.io-client';
const socket = io('http://localhost:4049')
// const socket = io.connect('http://localhost:4049')
const cx = classNames.bind(styles);
function createData( booking_code, client_name, email, timein, period, client_quantity, adult_quantity, children_quantity,table_name, booking_status, employee, note ) {
    return { 
        'Mã đặt bàn' : booking_code,
        'Khách hàng': client_name,
        'Email': email,
        'Giờ đến': timein,
        'Thời gian': period, 
        'Tổng số khách': client_quantity,
        'Tổng số khách(người lớn)': adult_quantity,
        'Tổng số khách(trẻ em)':children_quantity,
        'Phòng/bàn':table_name,
        'Trạng thái':booking_status, 
        'Nhân viên' : employee, 
        'Ghi chú' : note
    };
  }
  

  const excelData = (listBooking)=>{
    return listBooking.map(booking=>createData(booking.booking_code,booking.full_name, booking.email ? booking.email: '', 
    booking.booking_time, booking.period_time, booking.client_quantity, booking.adult_quantity, booking.children_quantity,
     booking.table[0].name, booking.booking_status, 'Vũ Đình Dũng', booking.booking_note))
  }
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 10,
      border: `2px solid #00408c`,
      padding: '0 4px',
    },
  }));

  function generateRandomCode(id) {
    let prefix = "KH"; // Tiền tố cho mã hóa đơn
    let invoiceCode = String(id).padStart(6, '0');
    return `KH${invoiceCode}`;
  }
  function generateRandomBookingCode(id) {
    let invoiceCode = String(id).padStart(6, '0');
    return `DB${invoiceCode}`;
  }
function Reception() {
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorProfileEl, setAnchorProfileEl] = useState(null);
    const [anchorNotiEl, setAnchorNotiEl] = useState(null);
    const openProfile = Boolean (anchorProfileEl);
    const openNoti = Boolean (anchorNotiEl);
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState(null);
    const [state, dispatch] = useStore();
    const {listBooking} = state;
    const [showAlert, setShowAlert] = useState();
    const [alertMessage, setAlertMessage] = useState({});
    const [listNoti, setListNoti] = useState([]);
    const navigate = useNavigate();
    const {timeline, status} = state;
    const [bookingStatus, setBookingStatus] = useState({
        waiting: true, 
        sorted:true, 
        accepted: true, 
        canceled: false
    })
    const instance = axios.create({
        baseURL: 'http://localhost:4049/api', // Change this to your backend URL
        withCredentials:true, 
        
        headers: {
            "content-type": "application/json"
          },
        
      });
    useEffect(()=>{
        instance.get('/reception')
        .then(res=>{
            if(res.data.status === 'success'){
                setAuth(true)
                setName(res.data.full_name);
            }
            else {
                setAuth(false)
                navigate('/login');
            }
        })
    }, [])
    useEffect(()=>{
        socket.on('notification', (data)=>{
            console.log(listNoti)
            // console.log(data)
            setListNoti([...listNoti, data])
        });
    },[socket, listNoti.length])
    const handleClickProfile = (event) => {
        setAnchorProfileEl(event.currentTarget);
    };
    const handleCloseProfile = () => {
        setAnchorProfileEl(null);
    };
    const handleClickNoti = (event) => {
        setAnchorNotiEl(event.currentTarget);
    };
    const handleCloseNoti = () => {
        setAnchorNotiEl(null);
    };
    const handleOpenDialog = ()=>setOpenDialog(true);
    const handleCloseDialog = ()=>setOpenDialog(false);
    const handleExportFile = ()=>
    {
        var data = excelData(listBooking)
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Apply cell styles
        const headerStyle = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: { bgColor: { indexed: 64 }, fgColor: { rgb: 'FFFF00' } }, // Yellow background color
        };
      
        // Apply header styles
        Object.keys(data[0]).forEach((key, index) => {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
          worksheet[cellAddress].s = headerStyle;
        });
      
        // Create a new workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoDatBan');
      
        // Convert the workbook to Excel file buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
        // Convert Excel file buffer to Blob
        const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
        // Save the Blob as an Excel file
        saveAs(fileData, 'baoCaoDatBan' + '.xlsx');
        
    }
    const handleChangeBookingStatus = (e)=>{
        const {name, checked} = e.target;
        setBookingStatus({
            ...bookingStatus, 
            [name] : checked
        })
        
    }
    const handleLogout = ()=>{
        instance.get('/logout')
        .then(res=>{
            navigate('/login')
        })
    }
    const handleAddNewBooking = async (data, index)=>{
        try 
        {
            //insert client 
            listNoti.splice(index, 1);
            setListNoti(listNoti);
            
            const res = await axios.get('http://localhost:4049/api/client/last_id');
            const newClientCode = generateRandomCode( res.data.id +1);
            const newClient = {full_name:data.full_name, phone_number: data.phone_number, client_code:newClientCode};
            const clientId = await axios.post('http://localhost:4049/api/client/new-from-client', newClient)
            const bookingId = await axios.get('http://localhost:4049/api/booking/last_id');
            const  newBookingCode = generateRandomBookingCode(bookingId.data.id +1);
            const newBooking = {booking_time: data.booking_time, booking_date: data.booking_date,adult_quantity: data.adult_quantity,
                 children_quantity: data.children_quantity, period_time:data.period_time, time_unit:data.time_unit,
                booking_code:newBookingCode, note:data.note, client_id: clientId.data.data}
            const result2 = await axios.post('http://localhost:4049/api/booking/new-from-client', newBooking)
            const newListBooking = await axios.get('http://localhost:4049/api/booking', {
                params:{
                    status, 
                    timeline
                }
            });
            if(result2.data.status === 'success')
            {
                dispatch(actions.setListBooking(newListBooking.data));
            }
            setAlertMessage({status:result2.data.status, message: result2.data.message});
            setShowAlert(true);
            //insert booking 
        }
        catch(error){
            console.log(error)
        }

    }
    return ( 
        <Fragment>

            <Box sx={{flexGrow:1}}>
                <Grid className={cx('wrapper')} container > 
                    <Grid className={cx('sidebar')} item xs={3}>
                        <Sidebar />
                    </Grid>
                    <Grid className={cx('container')} item xs={9}>
                        <Stack justifyContent="flex-end" sx={{backgroundColor:'#00408c', padding:'5px 0'}} direction="row">  
                             <Stack>
                                <Button
                                    id="noti-button"
                                    aria-controls={openNoti ? 'noti-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openNoti ? 'true' : undefined}
                                    onClick={handleClickNoti}
                                    sx={{color:'#fff'}}
                                >
                                    <StyledBadge badgeContent={listNoti.length} color="success">
                                        <NotificationsActiveOutlined fontSize="medium"/>
                                    </StyledBadge>
                                </Button>
                                <Menu
                                    anchorEl={anchorNotiEl}
                                    id="account-menu"
                                    open={openNoti}
                                    onClose={handleCloseNoti}
                                    onClick={handleCloseNoti}
                                    PaperProps={{
                                    elevation: 0,
                                    style: {
                                        width: '300px',
                                      },
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '.MuiMenuItem-root':{minWidth:100},
                                        '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                        },
                                    },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {listNoti.length > 0 ? 
                                    (
                                        listNoti.map((notiItem, index)=>(
                                            <MenuItem sx={{fontSize:14 , minWidth:100}} key={index} onClick={()=>handleAddNewBooking(notiItem, index)}>
                                                <ListItemIcon>
                                                    <AccountCircleOutlined sx={{marginRight:'5px'}}/>
                                                </ListItemIcon>
                                                <ListItemText sx={{'span':{fontSize:14}, maxWidth:'130px', whiteSpace:'nowrap',overflow:'hidden', textOverflow:'ellipsis'}} primary={notiItem.full_name} secondary={notiItem.phone_number}/>
                                                <ListItemText sx={{'span':{fontSize:11}, marginLeft:'10px'}} primary={<span>{notiItem.booking_time} - {notiItem.booking_date} </span>}
                                                 secondary={<span ><EscalatorWarning fontSize="small"/> {notiItem.adult_quantity} / <FamilyRestroom fontSize="small" sx={{marginLeft:'5px'}}/> {notiItem.children_quantity} (1 giờ)</span>}/>
                                                {/* <Typography variant="body2" color="text.secondary">
                                                    <IconButton size="small">
                                                        <Check  fontSize="small"/>
                                                    </IconButton>
                                                </Typography> */}
                                            </MenuItem>
                                        ))
                                    )
                                    :
                                    <MenuItem sx={{justifyContent:'center'}}>
                                        <span style={{fontSize:'14px', textAlign:'center'}}>Không có thông báo mới</span>
                                    </MenuItem>
                                    }
                                    
                                </Menu>
                             </Stack>
                                <Stack>
                                    <Button
                                    id="basic-button"
                                    aria-controls={openProfile ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openProfile ? 'true' : undefined}
                                    onClick={handleClickProfile}
                                    sx={{color:'#fff'}}
                                >
                                    <span style={{marginRight:'10px', fontSize:12}}>{name !== null && name}</span>
                                    <AccountCircleOutlined fontSize="medium"/>
                                </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorProfileEl}
                                        open={openProfile}
                                        onClose={handleCloseProfile}
                                        onClick={handleCloseProfile}
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}
                                        sx={{'.MuiList-root ':{fontSize:'10px !important'}}}
                                    >
                                        <MenuItem sx={{fontSize:14}} onClick={()=>navigate('/cashier')}>
                                                <NoteAltOutlined  fontSize="small" sx={{marginRight:'5px'}}/>
                                                Thu Ngân
                                        </MenuItem>
                                        <MenuItem sx={{fontSize:14}} onClick={handleLogout}>
                                            <LogoutOutlined fontSize="small" sx={{marginRight:'5px'}}/>
                                            Đăng Xuất
                                        </MenuItem>
                                    </Menu>
                                </Stack>
                            
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" style={{padding:'20px'}}>
                            <div className={cx('tabs-header')}>
                                <FormGroup sx={{display:'flex', flexDirection:'row'}}>
                                    <FormControlLabel control={<Checkbox checked={bookingStatus.waiting} color="warning" sx={{color:'#FF9900'}} size="small" onChange={handleChangeBookingStatus} name="waiting"/>} label="Chờ xếp bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:14}}} />
                                    <FormControlLabel control={<Checkbox  checked={bookingStatus.sorted} color="success" sx={{color:'#28B44F'}} size="small"  onChange={handleChangeBookingStatus} name="sorted"/>} label="Đã xếp bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:14}}}/>
                                    <FormControlLabel control={<Checkbox  checked={bookingStatus.accepted} color="primary"  sx={{color: '#0066CC'}} size="small" onChange={handleChangeBookingStatus} name="accepted"/>} label="Đã nhận bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:14}}} />
                                    <FormControlLabel control={<Checkbox  checked={bookingStatus.canceled}  sx={{color: pink[800],'&.Mui-checked': {color: pink[600]}}} size="small" onChange={handleChangeBookingStatus} name="canceled"/>} label="Đã hủy" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:14}}} />
                                </FormGroup>
                            </div>

                            <Stack spacing={2} direction="row">
                                <Button variant="outlined" size="small" sx={{fontSize:'10px', fontWeight:600}} onClick={handleExportFile}>
                                    <ArrowForward fontSize="small" sx={{marginRight:'5px'}}/>
                                    Xuất file
                                </Button>
                                <Button variant="contained" size="small" sx={{fontSize:'10px', fontWeight:600}} onClick={handleOpenDialog}>
                                    <EditCalendar fontSize="small" sx={{marginRight:'5px'}}/>
                                    Đặt bàn
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <DataTable tableStatus ={bookingStatus}/>
                            
                        </Stack>
                      

                    </Grid>
                </Grid>
            </Box>
            <CustomizedDialog onOpenDialog={handleOpenDialog} onCloseDialog={handleCloseDialog} isOpenDialog={openDialog}/> 
            {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
        </Fragment>
     );
}

export default Reception;