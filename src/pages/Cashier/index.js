import { useState, Fragment, useRef, useEffect, forwardRef } from 'react';
import axios from 'axios';
import styles from './Cashier.module.scss';
import classNames from 'classnames/bind';
import {Box, Tab, Tabs, IconButton, Stack, Button,Dialog, DialogTitle
, DialogContent, DialogActions, Input, TextField, Avatar, ListItemAvatar, ListItemText,
 OutlinedInput, MenuItem, Select, Slide,Grid ,List, ListItem, ListItemButton, ListItemIcon,
 ListSubheader, TableCell, TableBody, TableRow,Table, TableHead,TableContainer, Paper, 
ToggleButtonGroup, ToggleButton, Badge, Backdrop, CircularProgress} from '@mui/material';
import { Search,Close, TableRestaurant, HowToReg, FileDownloadDone,
 NotInterested, Restaurant, WineBar, CheckBox, Add,TableBar, DeleteOutlineOutlined,Remove, 
 ContentPaste,BorderColorOutlined,  Groups,Mode,MonetizationOnOutlined,Circle,
 Percent,Payments, Delete, AccountCircleOutlined} from '@mui/icons-material';

import { blue, red } from '@mui/material/colors';
import { TableIcon } from '../../assets/icons';
import avt from '../../assets/images/avt.jpg';
import NewClientDialog from '../../components/NewClientDialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PaymentPDF from '../../components/paymentPDF';
import { useReactToPrint as UseReactToPrint } from 'react-to-print';
import { useStore, actions } from '../../store';
import CustomAlert from '../../components/CustomAlert';
const cx  = classNames.bind(styles);





const tabs =[
  {
    id:0,
    label: 'Hóa đơn 1', 
    content: {
      client: 'Vũ Đình Dũng', 
      tableId: 1, 
      quantity:4, 
      order:[
        {
          id:0, 
          name: "Bún đậu mắm tôm", 
          note: 'đi kèm nước mắm', 
          price: 35000
        }
      ]
    }
  }
]
const menuOrderList = [
  {
    id:1, 
    name:'Bún đậu mắm tôm', 
    note:"dùng nước mắm ADSFJKHASDKJFHGASDKFLJASD FKJHASDKJFHASDKFLASDGBHXZCNMVB", 
    quantity:2, 
    price:35000
  }, 
  {
    id:2, 
    name:'Bún bò huế', 
    note:"Nhiều nước dùng", 
    quantity:2, 
    price:45000
  }, 
  {
    id:3, 
    name:'Bún bò huế', 
    note:"Nhiều nước dùng", 
    quantity:2, 
    price:45000
  }, 
  {
    id:4, 
    name:'Bún bò huế', 
    note:"Nhiều nước dùng", 
    quantity:2, 
    price:45000
  }, 
  {
    id:5, 
    name:'Bún bò huế', 
    note:"Nhiều nước dùng", 
    quantity:2, 
    price:45000
  }, 
  {
    id:6, 
    name:'Bún bò huế', 
    note:"Nhiều nước dùng", 
    quantity:2, 
    price:45000
  }
]


function Cashier() {
    const [state, dispatch] = useStore();
    const [tabValue, setTabValue] = useState(0);
    const [listArea, setListArea] = useState([]);
    const [areaTab, setAreaTab] = useState(1);
    const [menuGroup ,setMenuGroup] = useState(1);
    const [listMenuGroup, setListMenuGroup] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [titleSearchPop, setTitleSearchPop] = useState('');
    const [typeSearch, setTypeSearch] = useState(null);
    const [currentSelectedTable, setSelectedTable] = useState({
      tableId: null, 
      area: null
    });
    const [openNoteDialog, setOpenNoteDialog] = useState(false);
    const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
    const [rightTab, setRightTab] = useState(0);
    const [tabList, setTabList] = useState(tabs);
    const {listTable, listMenu} = state;
    const [currentNote, setCurrentNote] = useState({
      type: '', 
      id: null, 
      note: ''
    })
    
    const [newClientDialog, setNewClientDialog] = useState(false);

    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const inputRef = useRef();
    useEffect(()=>{
      if(tabValue === 0)
      {
        axios.get(`http://localhost:4049/api/table?area=${areaTab}`)
        .then(res=>dispatch(actions.setListTable(res.data)))
      }
      if(tabValue === 1)
      {
        axios.get(`http://localhost:4049/api/menu?menu_group=${menuGroup}`)
        .then(res=>dispatch(actions.setListMenu(res.data)))
      }
    }, [tabValue, areaTab, menuGroup])
    useEffect(()=>{
      axios.get('http://localhost:4049/api/area')
      .then(res=>setListArea(res.data))
      axios.get('http://localhost:4049/api/menu_group')
      .then(res=>setListMenuGroup(res.data))
    }, [])
    
    const handleSearchRoom = ()=>
    {
      setOpenSearch(true)
      setTitleSearchPop("Theo tên phòng bàn, số ghế");
      setTypeSearch('table');
    }
    const handleSearchMenu = ()=>
    {
      setOpenSearch(true);
      setTitleSearchPop("Theo tên món");
      setTypeSearch('menu');
    }
    const handleAddNewTab = ()=>
    {
      var lastTab = tabList[tabList.length -1 >=0 ? tabList.length -1 : 0];
      var newTab = {
        id:lastTab.id +1, 
        label:`hóa đơn ${lastTab.id + 2}`, 
        content:{}
      }
      setTabList([...tabList, newTab]);
    }
    const handleCancelTab = (id)=>
    {
      var newTabList = tabList.filter(prevTab=>prevTab.id !== id);
      if(newTabList.length === 0)
      {
        var newTab = {
          id:0, 
          label:`hóa đơn 1`, 
          content:{}
        }
        newTabList.push(newTab);
      }
      setTabList(newTabList);
    }
    const handleToggleNoteDialog = (e, type, id, note)=>
    {
      e.stopPropagation();
      setOpenNoteDialog(true);
      setCurrentNote({
        type, 
        id, 
        note
      })
      
    }
    return ( 
      <Fragment>
          <div className={cx('wrapper')}>
              <Grid container spacing={2} sx={{width:'100%', margin:0, height:'calc(100vh - 40px)'}}>
                
                  <Grid item xs={6} className={cx('left-wrapper')}>
                      <div className={cx('left-content')}>
                          <div className={cx('tab-header')}>
                              <Box sx={{fontSize:'10px' }}>
                                  <Tabs value={tabValue} onChange={(e, newValue)=>setTabValue(newValue)}  sx={{'button': {fontSize:'12px'}, '.MuiBox-root':{padding:0}}} >
                                      <Tab label="Phòng bàn" id= "simple-tab-0" aria-controls= "simple-tabpanel-0" />
                                      <Tab label="Thực đơn" id= "simple-tab-1" aria-controls= "simple-tabpanel-1"  />
                                  </Tabs>
                              </Box>
                              <TabContent value={tabValue} index={0} id='simple-tab-0'>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Tabs value={areaTab} onChange={(e, newValue)=>setAreaTab(newValue)}
                                        sx={{'button': {fontSize:'12px'}}} >
                                          {listArea.length > 0 && listArea.map((area, index)=>(
                                          <Tab label={area.name} id={`room-tab-${index}`} aria-controls={`room-tabpanel-${index}`} key={index} value={area.id}/>
                                          ))}
                                      </Tabs>
                                      <IconButton size="small" onClick={handleSearchRoom}>
                                        <Search fontSize="small" color='primary'/>
                                      </IconButton>
                                    </Stack>
                                  </Grid>
                                  {/* CONTENT */}
                                  <Grid item xs={12}>
                                    {listArea.length > 0 && listArea.map((area, index)=>(
                                        <TabContent value={areaTab} index={area.id} id={`room-tab-${area.id}`} key={index}>
                                        <Stack spacing={2} useFlexGap={true} direction="row" flexWrap="wrap"> 
                                        {listTable.length > 0 && listTable.map((table, index)=>{
                                          return (
                                          <button key={index}
                                          style={{fontSize:'12px', padding:'20px', display:'flex', flexDirection:'column', 
                                          backgroundColor:table.status && '#c2e0ff', border:"none", borderRadius:'10px', alignItems:'center'}}
                                          onClick={()=>setSelectedTable({tableId: table.id, area:table.area})} className={cx('table-list_item', {selected: table.id === currentSelectedTable.tableId})}>
                                            <span style={{marginBottom:'10px'}}>
                                              <TableIcon color={(table.id === currentSelectedTable.tableId  && table.area === currentSelectedTable.area) ?  "#fff" : (table.status ? '#0066CC' : '#002F66')}/>
                                            </span>
                                            <p style={{color:(table.id === currentSelectedTable.tableId  && table.area === currentSelectedTable.area) ? "#fff" : (table.status ? '#002F66' : '#111'), fontWeight:'600'}}>
                                              {table.name}
                                              </p>
                                            <div style={{width:'70px', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden', marginTop:'5px'}}>
                                              <p style={{color:'#86898d'}} onClick={(e)=>handleToggleNoteDialog(e, 'table', table.id, table.note)}>
                                                {table.note || 'Nhập ghi chú...'}
                                              </p>
                                            </div>
                                          </button>
                                          )
                                        })}
                                        </Stack>
                                        </TabContent>

                                    ))}
                                    
                                    {/* <TabContent value={areaTab} index={1} id="room-tab-2">
                                      Dungg
                                    </TabContent> */}
                                  </Grid>
                                </Grid>

                              </TabContent>
                              <TabContent value={tabValue} index={1} id='simple-tab-1'>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Box sx={{ maxWidth: { xs: 200, sm: 400 }, bgcolor: 'background.paper' }}>
                                        <Tabs value={menuGroup} onChange={(e, newValue)=>setMenuGroup(newValue)}
                                        sx={{'button': {fontSize:'12px'}}} variant="scrollable" scrollButtons="auto">
                                          {listMenuGroup.length > 0 && listMenuGroup.map((menuGroup, index)=>(
                                            <Tab label={menuGroup.name} id={`menu-tab-${menuGroup.id}`} aria-controls={`menu-tabpanel-${menuGroup.id}`} value={menuGroup.id} key={index}/>
                                          ))}
                                          
                                        </Tabs>
                                      </Box>
                                      <div>
                                        <IconButton size="small" onClick={handleSearchMenu}>
                                          <Search fontSize="small" color='primary'/>
                                        </IconButton>
                                        <Button size="small" onClick={()=>setOpenNewItemDialog(true)} variant="outlined" sx={{fontSize:'12px'}} >
                                          <Add fontSize="small" color='primary'/>
                                          Thêm
                                        </Button>
                                      </div>
                                    </Stack>
                                  </Grid>
                                  <Grid item xs={12} sx={{overflow:'auto', height:'490px'}}>
                                    {listMenuGroup.length > 0 && listMenuGroup.map(menu_group=>(

                                    <TabContent value={menuGroup} index={menu_group.id} id={`menu-tab-${menu_group.id}`}>
                                      <Stack spacing={2} useFlexGap={true} direction="row" flexWrap="wrap"> 
                                      {listMenu.reduce((newMenus, menu)=>{
                                        if(menu.is_active) return [...newMenus, menu];
                                        else return newMenus;
                                      }, [])
                                      .map(menu=>(
                                          <Button sx={{fontSize:"10px", display:'flex', flexDirection:'column', padding:0, width:'22.5%', height:'180px'}} 
                                          variant='outlined' size="small" key={menu.id}
                                          >
                                            <div style={{ backgroundColor:'#e6f0fa', width:'100%', position:'relative', height:'120px'}}>
                                              {menu.image_url !==  null 
                                              ?
                                                <img src={JSON.parse(menu.image_url)[0]} alt="" style={{width:'100%', height:'100%'}}  />
                                              : 
                                                (menu.menu_type_id === 1
                                                  ?
                                                  <Restaurant sx={{position:'absolute', top:'50%',left:'50%',transform:'translate(-50%, -50%)'}}/>
                                                  :
                                                  <WineBar sx={{position:'absolute', top:'50%',left:'50%',transform:'translate(-50%, -50%)'}}/>
                                                )
                                              }
                                              
                                              <p style={{fontSize:'12px', padding:'3px 5px', backgroundColor:'#f8fbfe',
                                               borderRadius:'10px', position:'absolute', bottom:'5px', left:'50%', 
                                               transform:'translateX(-50%)', objectFit:'contain'}}>
                                                {menu.price}đ
                                                </p>
                                            </div>
                                            <div style={{padding:'10px 0',  backgroundColor:'#f5f5f6', width:'100%', color:'#111',height:'calc(100% - 120px)'}}>
                                              <p style={{fontSize:'11px'}}>{menu.name}</p>
                                            </div>
                                          </Button>
                                      ))}
                                      </Stack>
                                    </TabContent>
                                    ))}
                                    
                                  </Grid>
                                </Grid>
                              </TabContent>
                              
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={6} className={cx('right-wrapper')}>
                    <div className={cx('right-content')}>
                      <Stack direction="row" justifyContent="flex-start" alignItems='center'>
                        <Box sx={{ maxWidth: { xs: 320, sm: 500 }, bgcolor: 'background.paper' }}>
                          <Tabs
                            value={rightTab}
                            onChange={(e, newValue)=>setRightTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                            sx={{'button': {fontSize:'12px'}, '.MuiBox-root':{padding:0}}} 
                          >

                            {tabList.map(tab=>(
                                <Tab  id='order-tab-0' aria-controls='order-tabpanel-0' 
                                label={<p style={{display:'flex', alignItems:'center'}}>{tab.label} 
                                 <Close fontSize="small" onClick={()=>handleCancelTab(tab.id)} sx={{color:'#111', marginLeft:'5px'}}/></p>} 
                                  key={tab.id}/>
                            ))}
                          </Tabs>
                        </Box>
                        <Button size="small" variant="contained" color='primary' onClick={handleAddNewTab}
                        sx={{minWidth:'30px', height:'30px', borderRadius:'50%', padding:0, marginLeft:'10px'}}>
                          <Add fontSize="small"/>
                        </Button>
                      </Stack>
                      {/* TAB CONTENT */}
                      <TabContent value={rightTab} index={0} id="order-tab-0">
                        <Stack>
                          <Grid container>
                            <Grid item xs={4}>
                                <Button variant="outlined" sx={{fontSize:'11px', borderRadius:'20px', cursor:'pointer'}}size="small" >
                                  <TableBar sx={{marginRight:'5px'}} fontSize="small"/>
                                  <p >Bàn số 3/Tầng 1</p>
                                </Button>
                            </Grid>
                            <Grid item xs={4} sx={{position:'relative'}}>
                              <OutlinedInput  size="small" 
                                sx={{borderRadius:'50px', backgroundColor:'#fff', paddingLeft:'7px', 
                                paddingRight:'7px', fontSize:'13px', width:'100%', 'input':{padding:'5px 0'}}} 
                                startAdornment={<Search color='primary' fontSize='small' sx={{marginRight:'10px'}}/>} 
                                endAdornment={<IconButton sx={{backgroundColor:"#fff"}} size="small" onClick={()=>setNewClientDialog(true)}><Add fontSize='small'/></IconButton>}
                                placeholder='Tìm khách hàng'  ref={inputRef}/>
                                <div style={{position:'absolute', width:'250px', backgroundColor:'white',
                                 borderRadius:'8px', maxHeight:'250px', boxShadow:'0 5px 8px rgba(0, 0, 0, 0.35)', overflow:'auto', zIndex:'10'}}>
                                  <List>
                                    <ListItem disablePadding sx={{fontSize:'10px'}}>
                                      <ListItemButton >
                                          <ListItemIcon>
                                           <AccountCircleOutlined />
                                          </ListItemIcon>
                                          <ListItemText primary="Vũ Đình Dũng"  secondary={<p>KH0001<br/>0869370492</p>}
                                          sx={{'.MuiListItemText-primary ':{fontSize:'14px',fontWeight:'600'},
                                           '.MuiListItemText-secondary ':{fontSize:'12px'}}}/>
                                      </ListItemButton>
                                    </ListItem>
                                    
                                  </List>
                                </div>
                            </Grid>
                          </Grid>
                        </Stack>
                        {/* DANH SÁCH MÓN ĂN ĐÃ CHỌN */}  
                        <List sx={{width:'100%', marginTop:'10px', height:'400px', overflow:'auto'}}>
                          {menuOrderList.map((order)=>(
                            <ListItem key={order.id} disablePadding sx={{borderRadius:'10px', border:'1px solid transparent', 
                            boxShadow:'0px 4px 10px rgba(0, 0, 0, 0.1)', padding:'10px', 
                            '.MuiListItemText-primary ':{fontSize:'14px',fontWeight:'600'}, '.MuiListItemText-secondary':{fontSize:'13px'}}}>
                                <ListItemIcon>
                                  <IconButton size='small'>
                                    <DeleteOutlineOutlined fontSize="small"/>
                                  </IconButton>
                                </ListItemIcon>
                                <ListItemText primary={order.name} 
                                secondary={<span style={{display:'flex', alignItems:'center'}}><ContentPaste sx={{marginRight:'5px'}} fontSize="small"/>
                                <span style={{maxWidth:'100px', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap', cursor:'pointer'}}
                                onClick={(e)=>handleToggleNoteDialog(e,  'menu', order.id)}>
                                  {order.note || 'Nhập ghi chú món'}
                                  </span></span>}/>
                                <ListItemText primary={
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton size="small" sx={{border:'1px solid black'}}>
                                      <Add fontSize="small"/>
                                    </IconButton>
                                      <span>{order.quantity}</span>
                                    <IconButton size="small" sx={{border:'1px solid black'}}>
                                      <Remove fontSize="small"/>
                                    </IconButton>
                                  </Stack>
                                  }
                                  />
                                <ListItemText primary={
                                  <span>{order.price}đ</span>
                                }/>
                            </ListItem>
                          ))}
                          
                        </List>
                      </TabContent>
                      
                      <div style={{width:'100%', backgroundColor:'#e6f0fa', height:'100px', borderRadius:'20px', padding:'10px'}}>
                        <Stack direction="row" sx={{width:'100%'}}>
                          <Grid container spacing={1}>
                            <Grid item xs={3}>
                              <Select
                                value=""
                                // onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{width:'100%', fontSize:'13px', '.MuiSelect-select':{padding:'7px 10px'},
                                borderRadius:'20px', bgcolor:'#dde7f1', 'fieldset':{border:0}}}
                                size='small'
                              >
                                <MenuItem value="" >
                                  <em>Vũ Đình Dũng</em>
                                </MenuItem>
                                {/* <MenuItem value={10}>Lê Tuấn Kiệt</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem> */}
                              </Select>
                              
                            </Grid>
                            <Grid item xs={2} sx={{textAlign:'center'}}>
                              <IconButton size="small" sx={{borderRadius:"20px", backgroundColor:'#dde7f1', padding:'6px 12px'}}>
                                <Groups fontSize="small"/>
                                <span style={{fontSize:'15px', fontWeight:'600', marginLeft:'5px'}}>4</span>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} sx={{textAlign:'left'}}>
                              <IconButton size="small" sx={{borderRadius:"20px", backgroundColor:'#dde7f1', padding:'6px'}}
                              onClick={(e)=>handleToggleNoteDialog(e,'order', null)}>
                                <Mode fontSize="small"/>
                              </IconButton>
                            </Grid>
                            <Grid item xs={5} sx={{textAlign:'right', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                              <p style={{fontWeight:'600', marginRight:'10px'}}>Tổng tiền:</p>
                              <h5 style={{fontSize:'20px'}}>500000đ</h5>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack direction="row" sx={{marginTop:'10px'}} justifyContent="center">
                            <Grid item xs={6} >
                              <Button variant='contained' color='success' sx={{width:'100%'}} onClick={()=>setOpenPaymentDialog(true)}>
                                <MonetizationOnOutlined sx={{marginRight:'10px'}}/>
                                Thanh toán
                              </Button>
                            </Grid>
                        </Stack>
                      </div>

                    </div>
                  </Grid>
              </Grid>
          </div>
          <SearchPopup openSearch={openSearch} onCloseSearch={()=>setOpenSearch(false)} title={titleSearchPop} type={typeSearch}
           setSelectedTable={setSelectedTable} setAreaTab={setAreaTab}/>
          <NoteDialog openDialog={openNoteDialog} onCloseDialog={()=>setOpenNoteDialog(false)} data={currentNote} setCurrentNote={setCurrentNote}/>
          <NewItemDialog openDialog={openNewItemDialog} onCloseDialog={()=>setOpenNewItemDialog(false)}/>
          <NewClientDialog openClientDialog={newClientDialog} onCloseClientDialog={()=>setNewClientDialog(false)}/>
          {/* <PaymentDialog openDialog={openPaymentDialog} onCloseDialog={()=>setOpenPaymentDialog(false)}/> */}
      </Fragment>
     );
}
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
function TabContent(props) {
    const { children, value, index,id,  ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={id}
        aria-labelledby={id}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }



function SearchPopup({openSearch, onCloseSearch, title, type, setSelectedTable, setAreaTab})
{
  const [selectedIndex, setSelectedIndex] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [listResult, setListResult] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [alertMessage, setAlertMessage] = useState({});
  console.log(type)
  const handleListItemClick = (event, id, status, table_name ,area) => {
    setSelectedIndex(id);
    if(status === 1)
      {
        setShowAlert(true);
        setAlertMessage({
          status:'error', 
          message:`${table_name} đã được sử dụng`
        })
      }
      else 
      {
        setSelectedTable({
          tableId:id, 
          area 
        });
        setAreaTab(area);
        setSearchValue('');
        setListResult([])
        onCloseSearch();
      }
  };
  useEffect(()=>{
    if(searchValue !== '')
      {
        var timer = setTimeout(()=>{
          if(type && type === 'table')
            {
              axios.get(`http://localhost:4049/api/table?q=${searchValue}`)
              .then(res=>setListResult(res.data))
            }
            if(type && type === 'menu')
              {
                axios.get(`http://localhost:4049/api/menu?q=${searchValue}`)
                .then(res=>setListResult(res.data))
              }

        }, 1000)
        return ()=>clearTimeout(timer)
      }
     
  }, [searchValue])
  console.log(listResult)
  return (
    <Fragment>
      <Dialog
        open={openSearch}
        onClose={onCloseSearch}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
        scroll="paper"
      >
        <DialogTitle id="alert-dialog-title" sx={{fontSize:'17px'}}>
          <form action="" >
              <Grid container spacing={2} >
                <Grid item xs={1}>
                  <Search sx={{marginTop:'10px'}} fontSize="medium" color='primary'/>
                </Grid>
                <Grid item xs={9}>
                  <TextField size="small" sx={{fontSize:'15px','fieldset':{border:'none'}}} fullWidth={true}
                   variant="outlined" placeholder={title} onChange={(e)=>setSearchValue(e.target.value)}/>
                </Grid>
              </Grid>
            </form>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onCloseSearch}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers={true}>
            <List  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            subheader={<ListSubheader component="div" sx={{top:'-20px'}}>
              {searchValue !== '' ? 'Kết quả tìm kiếm' : 'Không có kết quả tìm kiếm'}</ListSubheader>}>
              {
                type === 'table' 
                ? 
                listResult.map((table, index)=>(
                  <ListItem key={table.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      {table.is_active ===1 
                      ? 
                        (table.status === 0  ? <FileDownloadDone/> : <HowToReg />)
                      :
                        <NotInterested />
                      }
                      
                      </IconButton>} disablePadding>
                    <ListItemButton
                    disabled={table.is_active === 0}
                      onClick={(event) => handleListItemClick(event, table.id, table.status, table.name, table.area)} selected={selectedIndex === table.id }>
                        <ListItemAvatar>
                          {table.is_active === 1 
                          ? 
                              <Avatar sx={{bgcolor:table.status === 0  ? blue[500] :red[500]}}>
                                <TableRestaurant />
                              </Avatar>
                          :
                          <Avatar>
                            <TableRestaurant />
                          </Avatar>
                        }
                        </ListItemAvatar>
                        <ListItemText primary={table.name} secondary={<span>Số lượng: {table.chair_quantity}<br/>Khu vực:{table.area}</span>} />
                    </ListItemButton>
                  </ListItem>
                ))
                :
                listResult.map((menu, index)=>(
                  <ListItem key={menu.id}
                   disablePadding>
                    <ListItemButton
                    disabled={menu.is_active === 0}
                      onClick={(event) => handleListItemClick(event, index)} selected={selectedIndex === menu.id}>
                        <ListItemAvatar>
                          {menu.is_active ===1 
                          ? 
                              <Avatar sx={{bgcolor:blue[500]}}>
                                {
                                  menu.menu_type_id === 1
                                  ?
                                  <Restaurant />
                                  : 
                                  <WineBar />
                                }
                              </Avatar>
                          :
                          <Avatar>
                            {
                              menu.menu_type_id === 1
                              ?
                              <Restaurant />
                              : 
                              <WineBar />
                            }
                          </Avatar>
                        }
                        </ListItemAvatar>
                        <ListItemText primary={menu.name} secondary={<span>Giá tiền: {menu.price}</span>} />
                    </ListItemButton>
                  </ListItem>
                ))
              }
              
            </List>
        </DialogContent>
      </Dialog>
      {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
    </Fragment>
  )
}

function NoteDialog({openDialog, onCloseDialog, data, setCurrentNote})
{
  // useEffect(()=>{
  //   if(id !== null) 
  //   {
  //     if(type === 'table')
  //       setNoteItem(tables.find(table=>table.id === id));
  //     else if(type ==='menu')
  //       setNoteItem(menuOrderList.find(order=>order.id ===id));
  //   }
  //   else 
  //   {
  //     if(type === "order")
  //     {

  //     }
  //   }
  // },[])
  const [state, dispatch] = useStore();
  const [showAlert, setShowAlert] = useState();
  const [alertMessage, setAlertMessage] = useState({});
  
  const handleChangeNote = (e)=> setCurrentNote(prev=>({...prev, note:e.target.value}))
  const handleSaveNote = async ()=>{
    try 
    {
      if(data.type === 'table')
        {
          const result = await axios.put(`http://localhost:4049/api/table/update`, data)
          
          if(result.data.status === 'success')
          {
              const newListTable = await axios.get('http://localhost:4049/api/table');
              dispatch(actions.setListTable(newListTable.data));
          }
            setAlertMessage({status:result.data.status, message: result.data.message});
            setShowAlert(true);
        }
    }
    catch(error)
    {
      setAlertMessage({status:'error', message: error});
      setShowAlert(true);
    }
    finally
    {
      onCloseDialog();
    }
    
  }
  return (
    <Fragment>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={onCloseDialog}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle fontSize="17px">Ghi chú phòng/bàn</DialogTitle>
        <DialogContent>
         <Input fullWidth={true} startAdornment={<BorderColorOutlined fontSize='small'/>}  onChange={handleChangeNote} value={data.note}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveNote} variant="contained" color="primary" size="small">
            <CheckBox fontSize="small" sx={{marginRight:'5px'}}/>
            Xong
          </Button>
          <Button onClick={onCloseDialog} variant="contained" sx={{bgcolor:'#85888c'}} size="small">
            <NotInterested fontSize="small" sx={{marginRight:'5px'}}/>
            Bỏ qua
            </Button>
        </DialogActions>
      </Dialog>
      {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
    </Fragment>
  )
}

function NewItemDialog({openDialog, onCloseDialog})
{
  const [state, dispatch] = useStore();
  const [isLoading, setLoading]= useState(false);
  const [imageSrcs, setImageSrcs] = useState([]);
  const [renderMenuGrOption, setRenderMenuGrOption] = useState([{title:'Món khai vị', value:2}, {title:'Món chính', value:1}, {title:'Món tráng miệng', value:3}]);
  const [alertMessage, setAlertMessage] = useState({status:'', message:''});
  const [showAlert, setShowAlert] = useState(false);
  const [menuInfo, setMenuInfo] = useState({
    files: [], 
    menu_name:'', 
    menu_type_id: 1, 
    menu_group_id: null, 
    menu_price: null, 
    menu_desc:''
  })
 
  const handleFileChange = (event, index)=>
    {
      const file = event.target.files[0];
      const newFiles = menuInfo.files;
      newFiles[index] = file;
      setMenuInfo(prevInfo=>({...prevInfo, files:newFiles}))
      if(file)
      {
        const reader = new FileReader();
        reader.onloadend = ()=>{
          const newImageSrcs = [...imageSrcs];
          newImageSrcs[index] = reader.result;
          setImageSrcs(newImageSrcs);
        }
        reader.readAsDataURL(file);
      }
    }
    const handleRemoveImage = (index)=>{
      setImageSrcs(prevImageSrcs => {
        const newImageSrcs = [...prevImageSrcs];
        newImageSrcs[index] = null;
        return newImageSrcs;
      });
      setMenuInfo(prevInfo=>{
        const newFiles = prevInfo.files;
        newFiles[index] = null;
        return {...prevInfo, files:newFiles}
      })
    }
    const handleChangeMenuType = (e)=>
      {
        const selectOption  = e.target.value;
        setMenuInfo(prevInfo=>({...prevInfo, menu_type_id: selectOption}))
        if(selectOption === 1)
          setRenderMenuGrOption([{title:'Món khai vị', value:2}, {title:'Món chính', value:1}, {title:'Món tráng miệng', value:3}])
        else if(selectOption === 2)
          setRenderMenuGrOption([{title:'Nước ép', value:4}, {title:'Rượu', value:5}]);
      }
    const handleChangeMenuGroup = (e)=>{
      setMenuInfo(prevInfo=>({...prevInfo, menu_group_id: e.target.value}))
    }
    const handleChangeInput = (name, value)=>{
      setMenuInfo(prevInfo=>({...prevInfo, [name]: value}))
    }
    const hanleSaveMenu  = async ()=>{
      setLoading(true);
      const formData = new FormData();
      menuInfo.files.forEach(file=>{
        formData.append('img_path', file);
      })
      formData.append('menu_name', menuInfo.menu_name);
      formData.append('menu_type_id', menuInfo.menu_type_id);
      formData.append('menu_price', menuInfo.menu_price);
      formData.append('menu_group_id', menuInfo.menu_group_id);
      formData.append('menu_desc', menuInfo.menu_desc);
      try 
      {
        var result  = await axios.post('http://localhost:4049/api/menu/new', formData)
        var newListMenu = await axios.get('http://localhost:4049/api/menu');
        if(result.data.status ==='success')
          dispatch(actions.setListMenu(newListMenu))
        setAlertMessage({status:result.data.status, message: result.data.message});
        setShowAlert(true);
      }
      catch(error)
      {
        setAlertMessage({status:'error', message: error.message});
        setShowAlert(true);
      }
      finally{
        setLoading(false)
        onCloseDialog();
      }
    }
  return (
    <Fragment>
      <Dialog
        onClose={onCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thêm thực đơn
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
          <Close />
        </IconButton>
        <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={5} sx={{display:'flex', alignItems:'flex-end'}}>
                    <p style={{fontWeight:'600'}}>Tên thực đơn</p>
                  </Grid>
                  <Grid item xs={7}>
                    <Input fullWidth={true} name='menu_name' onChange={e=>handleChangeInput(e.target.name, e.target.value)} sx={{fontSize:'14px'}}/>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={5} sx={{display:'flex', alignItems:'flex-end'}}>
                    <p style={{fontWeight:'600'}}>Loại thực đơn</p>
                  </Grid>
                  <Grid item xs={7}>
                    <Select
                        onChange={handleChangeMenuType}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        fullWidth={true}                     
                        size='small'
                        sx={{fontSize:'14px' , padding:0}}
                        defaultValue={1}
                      >
                        <MenuItem value={1} sx={{fontSize:'14px'}} >
                          Đồ ăn 
                        </MenuItem>
                        <MenuItem value={2} sx={{fontSize:'14px'}}>Đồ uống</MenuItem>
                      </Select>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop="1px">
              <Grid item xs={5}>
                <Grid container>
                  <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                    <p style={{fontWeight:'600'}}>Giá bán</p>
                  </Grid>
                  <Grid item xs={8} >
                    <Input fullWidth={true} name="menu_price" onChange={(e)=>handleChangeInput(e.target.name, e.target.value)} sx={{fontSize:'14px'}}/>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={7}>
                <Grid container>
                  <Grid item xs={4} sx={{display:'flex', alignItems:'flex-end'}}>
                    <p style={{fontWeight:'600'}}>Nhóm</p>
                  </Grid>
                  <Grid item xs={8} >
                    
                    <Select
                      onChange={handleChangeMenuGroup}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      fullWidth={true}                     
                      size='small'
                      sx={{fontSize:'14px' , padding:0}}
                      defaultValue=""
                    >
                       <MenuItem value="" sx={{fontSize:'14px'}} > -- Chọn nhóm thực đơn -- </MenuItem>
                      {renderMenuGrOption.length > 0 &&
                       renderMenuGrOption.map((option, index)=>(
                       <MenuItem value={option.value} sx={{fontSize:'14px'}} key={index}>{option.title}</MenuItem>
                      ))
                    }
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container marginTop="20px">
              <Grid item xs={2} sx={{display:'flex', alignItems:'flex-end'}}>
                  <p style={{fontWeight:'600'}}>Ghi chú</p>
              </Grid>
              <Grid item xs={5}>
                <Input fullWidth={true}  name='menu_desc'
                onChange={(e)=>handleChangeInput(e.target.name, e.target.value)} placeholder='Nhập ghi chú' sx={{fontSize:'14px'}}/>
              </Grid>
            </Grid>
            <Grid container marginTop="30px">
              <Grid item xs={12}>
                <p  style={{fontWeight:'600'}}>Hình ảnh</p> <br/>
              </Grid>
              <Grid item xs={12}>
                <form>
                  <Stack flexWrap="wrap" spacing={2} direction="row" justifyContent="space-around">
                    {[0,1,2,3].map((index)=>
                       (
                          <div  className={cx('form-group')} key={index}>
                            {!imageSrcs[index] && (
                              <label htmlFor={`upload-image-${index}`} >
                                  <Add color='primary'/>
                                  <p>Thêm ảnh</p>
                                  <span>Tối đa 2MB</span>
                              </label>
                            )}
                            <input  type='file' id={`upload-image-${index}`} hidden onChange={(event)=>handleFileChange(event, index)}/>
                            {imageSrcs[index] && (
                              <div style={{position:'relative', width:'100%', height:'100%'}}>
                                <Badge badgeContent={<Close fontSize="small" sx={{fontSize:'13px'}}/>} color="primary" 
                                sx={{width:'100%', height:'100%', '.MuiBadge-badge':{padding:0}}}
                                onClick={()=>handleRemoveImage(index)}>
                                  <img src={imageSrcs[index]} alt=""  />
                                </Badge>
                              </div>
                            )}
                          </div>
                      )
                    
                    )}
                     
                  </Stack>
                </form>
              </Grid>
            </Grid>
      
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={hanleSaveMenu} variant="contained" color="primary" size="small">
            Lưu lại
          </Button>
          <Button autoFocus onClick={onCloseDialog} variant="outlined" color="primary" size="small">
            Bỏ qua
          </Button>
        </DialogActions>
      </Dialog>
      {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
      open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  )
}

function createData(id, name, quantity, price) {
  return { id, name, quantity, price };
}

const rows = [
  createData(1, 'Bún bò huế', 1, 45000),
  createData(2, 'Bún bò huế', 1, 45000),
];
// function PaymentDialog({openDialog, onCloseDialog})
// {
//   const [discountUnit, setDiscountUnit] = useState('cash');
//   const pdfRef = useRef();

//   const handleChangeDiscountUnit = (event, unit) => {
//     setDiscountUnit(unit);
//   };
//   const handlePayment = UseReactToPrint({
//     content:()=>pdfRef.current ,
//     documentTitle:'payment', 
//     onAfterPrint:()=>onCloseDialog()
//   })
 
//   return (
//     <Fragment>
//       <Dialog
//         open={openDialog}
//         keepMounted
//         onClose={onCloseDialog}
//         aria-describedby="alert-dialog-slide-description"
//         TransitionComponent={Transition}
//         sx={{
//           "& .MuiDialog-container": {
//             "& .MuiPaper-root": {
//               width: "100%",
//               maxWidth: "1000px", 
//               maxHeight:'100vh',
//               height:'100%' , 
//               borderRadius:0
//             },
//           },
//         }}
//         PaperProps={{sx:{position:'fixed', right:'-32px', top:'-32px'}}}
//       >
//         <DialogTitle fontSize="17px" display="flex" flexDirection="row"  alignItems="center">
//           <h4>Phiếu thanh toán - Hóa đơn 1</h4>
//           <Circle size="small" color='primary' sx={{width:'10px', height:'10px', margin:'0 10px'}}/>
//           <h4 style={{color:'#0066CC'}}>Bàn số 2/Tầng 1</h4>
//         </DialogTitle>
//         <DialogContent>
//          <Grid container spacing={4} >
//           <Grid item xs={8} >
//           <TableContainer >
//             <Table aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell  align="left">STT</TableCell>
//                   <TableCell align="left">Tên món</TableCell>
//                   <TableCell align="left">Số lượng</TableCell>
//                   <TableCell align="left">Thành tiền</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                   >
//                     <TableCell  align="left">
//                       {row.id}
//                     </TableCell>
//                     <TableCell align="left">
//                       <h4>{row.name}</h4>
//                       <p style={{fontSize:'12px', maxWidth:'200px', whiteSpace:'pre-line',
//                        whiteSpaceCollapse:'preserve-breaks', textWrap:'wrap', wordBreak:'break-word' }}>
//                         Nhiều rau
//                       </p>
//                     </TableCell>
//                     <TableCell align="left">{row.quantity}</TableCell>
//                     <TableCell align="left">{row.price}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
          
//           </Grid>
//           <Grid item xs={4}>
//             <Grid container marginBottom="10px">
//               <Grid item xs={6} display="flex" alignItems="flex-end" marginRight="10px">
//                 <p style={{fontSize:'14px', fontWeight:'600'}}>Tổng tiền hàng</p>
//               </Grid>
//               <Grid item xs={6}>
//                 <h3 style={{textAlign:'right'}}>459,000</h3>
//               </Grid>
//             </Grid>

//             <Grid container marginBottom="20px">
//               <Grid item xs={5} display="flex" alignItems="flex-end">
//                 <p style={{fontSize:'14px', fontWeight:'600'}}>Giảm giá ({discountUnit ==='cash' ? 'VND' : '%'})</p>
//               </Grid>
//               <Grid item xs={7}>
//                 <Input fullWidth={true} endAdornment={
//                 <ToggleButtonGroup
//                 color="primary"
//                 value={discountUnit}
//                 exclusive
//                 onChange={handleChangeDiscountUnit}
//                 aria-label="Platform"
//                 size='small'
//                 sx={{'button':{padding:'5px 10px'}, 'svg':{fontSize:'14px'}}}
//               >
//                 <ToggleButton value="percent" >
//                   <Percent />
//                 </ToggleButton>
//                 <ToggleButton value="cash" >
//                   <Payments  />
//                 </ToggleButton>
//               </ToggleButtonGroup>
//                 }/>
//               </Grid>
//             </Grid>

//             <Grid container marginBottom="20px">
//               <Grid item xs={6} display="flex" alignItems="flex-end">
//                 <p style={{fontSize:'14px', fontWeight:'600'}}>Khách cần trả</p>
//               </Grid>
//               <Grid item xs={6}>
//                 <h3 style={{textAlign:'right'}}>459,000</h3>
//               </Grid>
//             </Grid>

//             <Grid container >
//               <Grid item xs={12} display="flex" alignItems="flex-end" justifyContent="center">
//                 <Button variant="contained" color="success"  onClick={handlePayment}>
//                   <MonetizationOnOutlined sx={{marginRight:'10px'}}/>
//                   Thanh Toán
//                   </Button>
//               </Grid>
             
//             </Grid>

//           </Grid>

//          </Grid>
//         </DialogContent>
//       </Dialog>
//       <PaymentPDF ref={pdfRef}/>
//     </Fragment>
//   )
// }
export default Cashier;