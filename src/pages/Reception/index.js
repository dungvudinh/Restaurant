import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import classNames from "classnames/bind";
import styles from './Reception.module.scss';
import Sidebar from "../../components/Sidebar";
import DataTable  from '../../components/DataTable';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import {AccountCircleOutlined, ArrowForward, Check, EditCalendar, LogoutOutlined, NoteAltOutlined, NotificationsActiveOutlined} from '@mui/icons-material';
import {Grid,Box, FormGroup, FormControlLabel, Checkbox, Button, Stack, Menu, MenuItem, Badge, ListItemIcon, ListItemText, Typography, IconButton} from '@mui/material';
import CustomizedDialog from "../../components/Dialog";
import * as XLSX from 'xlsx/xlsx.mjs';
const cx = classNames.bind(styles);
function createData(  id, timein, client, phone, quantity, room, status, note) {
    return { id, timein, client, phone, quantity, room, status, note };
  }
  
  const rows = [
    createData('DB001','20/04/2024 8:30', 'Vũ Đình Dũng', '0355969145', 4, 6,1, 'Khách đến muộn 30p'),
    createData('DB002', '20/04/2024 8:30', 'Lê Tuấn Kiệt','0355969145', 4, 6, 1,'Khách đến muộn 30p'),
  ];
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 10,
      border: `2px solid #00408c`,
      padding: '0 4px',
    },
  }));
function Reception() {
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorProfileEl, setAnchorProfileEl] = useState(null);
    const [anchorNotiEl, setAnchorNotiEl] = useState(null);
    const openProfile = Boolean (anchorProfileEl);
    const openNoti = Boolean (anchorNotiEl);
    const [bookingStatus, setBookingStatus] = useState({
        waiting: true, 
        sorted:true, 
        accepted: true, 
        canceled: false
    })
  
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
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb,ws,'BaoCaoDatBan');
        XLSX.writeFile(wb, "baoCaoDatBan.xlsx");
    }
    const handleChangeBookingStatus = (e)=>{
        const {name, checked} = e.target;
        setBookingStatus({
            ...bookingStatus, 
            [name] : checked
        })
        
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
                                    <StyledBadge badgeContent={4} color="success">
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
                                    <MenuItem sx={{fontSize:14 , minWidth:100}}>
                                        <ListItemIcon>
                                            <AccountCircleOutlined sx={{marginRight:'5px'}}/>
                                        </ListItemIcon>
                                        <ListItemText sx={{'span':{fontSize:14}}} primary="Lê Tuấn Kiệt" secondary="0869370492"/>
                                        <ListItemText sx={{'span':{fontSize:11}}} primary={<span>Giờ đến: 20:00</span>} secondary={<span>Thời lượng: 1 giờ</span>}/>
                                        <Typography variant="body2" color="text.secondary">
                                            <IconButton size="small">
                                                <Check  fontSize="small"/>
                                            </IconButton>
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem sx={{fontSize:14 , minWidth:100}}>
                                        <ListItemIcon>
                                            <AccountCircleOutlined sx={{marginRight:'5px'}}/>
                                        </ListItemIcon>
                                        <ListItemText sx={{'span':{fontSize:14}}} primary="Lê Tuấn Kiệt" secondary="0869370492"/>
                                        <ListItemText sx={{'span':{fontSize:11}}} primary={<span>Giờ đến: 20:00</span>} secondary={<span>Thời lượng: 1 giờ</span>}/>
                                        <Typography variant="body2" color="text.secondary">
                                            <IconButton size="small">
                                                <Check  fontSize="small"/>
                                            </IconButton>
                                        </Typography>
                                    </MenuItem>
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
                                    <span style={{marginRight:'10px', fontSize:12}}>Vũ Đình Dũng</span>
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
                                        <MenuItem sx={{fontSize:14}}>
                                            <Link to="/cashier" style={{display:'flex', alignItems:'center', color:'#111'}}>
                                                <NoteAltOutlined  fontSize="small" sx={{marginRight:'5px'}}/>
                                                Thu Ngân
                                            </Link>
                                        </MenuItem>
                                        <MenuItem sx={{fontSize:14}}>
                                            <Link to="/logout" style={{display:'flex', alignItems:'center', color:'#111'}}>
                                                <LogoutOutlined fontSize="small" sx={{marginRight:'5px'}}/>
                                            Đăng Xuất
                                            </Link>
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
        </Fragment>
     );
}

export default Reception;