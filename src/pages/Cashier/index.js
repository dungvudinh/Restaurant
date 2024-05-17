import { useState, Fragment, useRef, useEffect, forwardRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Cashier.module.scss';
import classNames from 'classnames/bind';
import {Box, Tab, Tabs, IconButton, Stack, Button,Dialog, DialogTitle
, DialogContent, DialogActions, Input, TextField, Avatar, ListItemAvatar, ListItemText,
 MenuItem, Select, Slide,Grid ,List, ListItem, ListItemButton, 
 ListSubheader, TableCell, TableBody, TableRow,Table, TableHead,TableContainer, 
ToggleButtonGroup, ToggleButton, Badge, Backdrop, CircularProgress, Menu, 
InputLabel,
ListItemIcon} from '@mui/material';
import { Search,Close, TableRestaurant, HowToReg, FileDownloadDone,
 NotInterested, Restaurant, WineBar, CheckBox, Add,BorderColorOutlined,  Groups,Mode,MonetizationOnOutlined,Circle,
 Percent,Payments,
 RestaurantMenu, ExpandMore, 
 MenuOutlined} from '@mui/icons-material';

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
import CustomTabContent from '../../components/CustomTabContent';
import zlpay from '../../assets/images/zlpay.png'
const cx  = classNames.bind(styles);

function generateRandomCode(id) {
  let invoiceCode = String(id).padStart(6, '0');
  return `HD${invoiceCode}`;
}

function Cashier() {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const [tabValue, setTabValue] = useState(0);
    const [listArea, setListArea] = useState([]);
    const [areaTab, setAreaTab] = useState(1);
    const [menuGroup ,setMenuGroup] = useState(1);
    const [listMenuGroup, setListMenuGroup] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [titleSearchPop, setTitleSearchPop] = useState('');
    const [typeSearch, setTypeSearch] = useState(null);
    const [alertMessage, setAlertMessage] = useState({status:'', message:''});
    const [showAlert, setShowAlert] = useState(false);
    const [currentSelectedTable, setSelectedTable] = useState({
      tableId: null, 
      tableName: '', 
      area: null, 
      status: null
    });
    const [openNoteDialog, setOpenNoteDialog] = useState(false);
    const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
    const [currentOrderTab, setCurrentOrderTab] = useState(0);
    const {listTable, listMenu, listOrder} = state;
    const [currentNote, setCurrentNote] = useState({
      type: '', 
      id: null, 
      note: ''
    })
    const [newClientDialog, setNewClientDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [currentOrderMenu, setCurrentOrderMenu] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isDisablePayment, setDisablePayment] = useState(true);
    const [openClientQuantityDialog, setOpenClientQuantityDialog] = useState(false);

    const [newOrder, setNewOrder] = useState({
      order_code: '', 
      client_id: null, 
      client_quantity:1, 
      employee_id:1, 
      order_menu: [], 
      table_id: null, 
      area:null, 
      booking_code:null , 
      id: null, 
      order_id :null,
      table_name: '', 
      note:''
    })
    const [userName, setUserName] = useState(null);
    const instance = axios.create({
      baseURL: 'http://localhost:4049/api', // Change this to your backend URL
      withCredentials:true, 
      
      headers: {
          "content-type": "application/json"
        },
      
    });
    useEffect(()=>{
        instance.get('http://localhost:4049/api/cashier')
        .then(res=>{
            if(res.data.status === 'success'){
                setUserName(res.data.full_name);
            }
            else {
                navigate('/login');
            }
        })
    }, [])
    // useEffect(()=>{

    // }, [listOrder[currentOrderTab].order_menu.length, ])
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
      axios.get('http://localhost:4049/api/order')
      .then(res=>{
        var newListOrder;
        if(typeof listOrder === 'bject')
          newListOrder = [res.data];
        else 
          newListOrder = res.data
        if(newListOrder.length > 0 )
          setCurrentOrderMenu(newListOrder[currentOrderTab].order_menu);
        dispatch(actions.setListOrder(newListOrder))
      })
      axios.get('http://localhost:4049/api/order/last_order_id')
      .then(res=>setCurrentOrderId(res.data.order_id))
    }, [])
    useEffect(()=>{
        if(listOrder.length > 0 )
          setCurrentOrderMenu(listOrder[currentOrderTab].order_menu)
    }, [currentOrderTab])
  
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
      const newOrderId = currentOrderId +1;
      const newOrderCode = generateRandomCode(newOrderId);
      var newOrderObj = null;
      if(currentSelectedTable.status === 0)
        newOrderObj = {...newOrder, order_code: newOrderCode, order_id: newOrderId, table_id: currentSelectedTable.tableId, table_name: currentSelectedTable.tableName, area: currentSelectedTable.area};
      else 
        newOrderObj = {...newOrder, order_code: newOrderCode, order_id: newOrderId}
      setCurrentOrderTab(listOrder.length);
      setCurrentOrderId(newOrderId);
      setCurrentOrderMenu([])
      // setNewOrder(newOrderObj)
      dispatch(actions.setListOrder([...listOrder, newOrderObj]))
    }
    
    const handleCancelTab = (e, index, order)=>
    {
      e.stopPropagation();
      listOrder.splice(index, 1);
      dispatch(actions.setListOrder(listOrder))
      if(listOrder.length === 0)
        handleAddNewTab();
      if(index < currentOrderTab)
        setCurrentOrderTab(index);
      else if(index > currentOrderTab)
        setCurrentOrderTab(index -1);
      else 
        setCurrentOrderTab(()=> index -1  < 0 ? 0 : (index -1));
      // check nếu đã gọi món thì mới call api để thực hiện thao tác 
      if(order.order_menu.length > 0 ){
        //check nếu bàn đã được chọn thì mới update lại trạng thái bàn
        if(order.table_id !== null){
          axios.put('http://localhost:4049/api/table/update-status', {table_id: order.table_id, status: 0});
          listOrder.splice(index, 1);
          dispatch(actions.setListOrder(listOrder));
        }
        //xóa order
        axios.delete('http://localhost:4049/api/order/delete', {data:{order_id:order.id}})
        
        const newListTable = listTable.map(tableItem=>{
          if(tableItem.id === order.table_id)
            tableItem.status = 0;
          return tableItem;
        })
        dispatch(actions.setListTable(newListTable));
      }
      else 
      {
        //order được tạo từ booking
        if(order.booking_code !== null){
          //update status booking
          //check nếu bàn đã được chọn thì mới update lại trạng thái bàn
        if(order.table_id !== null){
          axios.put('http://localhost:4049/api/table/update-status', {table_id: order.table_id, status: 0});
          listOrder.splice(index, 1);
          dispatch(actions.setListOrder(listOrder));
        }
        //xóa order
        axios.delete('http://localhost:4049/api/order/delete', {data:{order_id:order.id}})
        axios.put('http://localhost:4049/api/booking/update-status', {booking_code: order.booking_code, status:2})
        
        const newListTable = listTable.map(tableItem=>{
          if(tableItem.id === order.table_id)
            tableItem.status = 0;
          return tableItem;
        })
        dispatch(actions.setListTable(newListTable));
        }
      }
      
      
        
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
    const handleSelectedTable = (table)=>
      {
        setSelectedTable({tableId: table.id, area:table.area, tableName:table.name, status: table.status})
        var selectTabIndex = null;
          listOrder.forEach((order, index)=>{
            if(order.table_id  === table.id){
              selectTabIndex = index;
              return;
            }
          })
          //nếu  chọn vào bàn trống và bàn này chưa nằm trong order mới nào
        if(selectTabIndex === null){
          listOrder[currentOrderTab].table_id  = table.id;
          listOrder[currentOrderTab].area  = table.area;
          listOrder[currentOrderTab].table_name  = table.name;
          
          dispatch(actions.setListOrder(listOrder));
          // const newOrderId = currentOrderId +1;
          // const newOrderCode = generateRandomCode(newOrderId);
          // setCurrentOrderTab(listOrder.length);
          // setCurrentOrderId(newOrderId);
          // setCurrentOrderMenu([])
          // setNewOrder(prevOrder=>({...prevOrder, order_code: newOrderCode, order_id: newOrderId, table_id: table.id, table_name: table.name, area: table.area}))
          // dispatch(actions.setListOrder([...listOrder, {...newOrder, order_code: newOrderCode, order_id: newOrderId, table_id: table.id, table_name: table.name, area: table.area}]))
        }
        else{
          // không cho phép đổi bàn khi đã chọn món
          if(table.status !== 1){
            console.log("CURRENT ORDER TAB: ", currentOrderTab)
            // console.log(listOrder[selectTabIndex])
            if(listOrder[currentOrderTab].order_menu.length > 0){
              if(listOrder[currentOrderTab].table_id !== null){
                // setShowAlert(true)
                // setAlertMessage({status:'error', message:'Không cho phép đổi bàn khi đã chọn món'})
              }
              else{
                axios.put('http://localhost:4049/api/table/update-status', {table_id: table.id, status: 1});
                const newLisTable = listTable.map(tableItem=>{
                  if(tableItem.id ===  table.id)
                    tableItem.status = 1;
                  return tableItem;
                })
                dispatch(actions.setListTable(newLisTable));
                listOrder[currentOrderTab].table_id = table.id;
                listOrder[currentOrderTab].area = table.area;
                listOrder[currentOrderTab].table_name = table.name;
                //id = null: order là bản ghi mới, thêm vào bảng order
                if(listOrder[currentOrderTab].id === null)
                  axios.post(`http://localhost:4049/api/order/new`, listOrder[currentOrderTab])
                //id != null order là bản ghi đã lưu trong db , cập nhập db
                else
                  axios.put('http://localhost:4049/api/order/update-other', listOrder[currentOrderTab])
                
                 
              }
            }
            
            else{
              listOrder[currentOrderTab].table_id = table.id;
              listOrder[currentOrderTab].area = table.area;
              listOrder[currentOrderTab].table_name = table.name;
            }
            dispatch(actions.setListOrder(listOrder))
          }
          else 
          {
            
            // setShowAlert(true)
            // setAlertMessage({status:'error', message:'Không cho phép chọn bàn đang có khách ngồi'})
          }

        }
      }
    const handleSelectMenu = (menu)=>{

      //nếu đã chọn trùng, tăng số lượng sản phẩm lên 1 
      var updateCurrentOrderMenu = [...currentOrderMenu];
      if(updateCurrentOrderMenu.some(orderMenu=>orderMenu.order_menu_id === menu.id)){
        updateCurrentOrderMenu =  updateCurrentOrderMenu.map(orderMenu=>{
          if(orderMenu.order_menu_id === menu.id)
            orderMenu.order_menu_quantity = orderMenu.order_menu_quantity  +1;
          return orderMenu;
        })
      }
      else {
        updateCurrentOrderMenu.push({order_menu_id:menu.id, order_menu_name: menu.name, order_menu_note: '', order_menu_price:menu.price, order_menu_quantity:1}); 
      }
      listOrder[currentOrderTab].order_menu = updateCurrentOrderMenu;
      //nếu id = null, tạo order 
      
      //check xem đã chọn bàn chưa, nếu rồi thì update trạng thái bàn
      if(listOrder[currentOrderTab].table_id !== null){
        const newListTable = listTable.map(tableItem=>{
          if(tableItem.id === listOrder[currentOrderTab].table_id)
            tableItem.status = 1;                      
          return tableItem;
        })
        dispatch(actions.setListTable(newListTable))
        console.log(listOrder[currentOrderTab])
        axios.put('http://localhost:4049/api/table/update-status', {table_id: listOrder[currentOrderTab].table_id, status: 1});

        if(listOrder[currentOrderTab].id === null && listOrder[currentOrderTab].order_menu.length === 1){
          //với lần chọn món đầu tiên, order sẽ đk lưu vào DB
          axios.post(`http://localhost:4049/api/order/new`, listOrder[currentOrderTab])
        }
        else{
            // nếu đã chọn bàn, update thông tin order 
            //với các lần chọn món tiếp theo, order_menu sẽ được update
            //get order by order_code 
            axios.put('http://localhost:4049/api/order/update-other', listOrder[currentOrderTab])
        }
     
        dispatch(actions.setListOrder(listOrder))
      }
      
      setCurrentOrderMenu(updateCurrentOrderMenu)
    }
    const calcMoney = (order_menu)=>{
      var total =0;
      order_menu.forEach(orderMenuItem=>{
        total = total + (orderMenuItem.order_menu_price * orderMenuItem.order_menu_quantity);
      })
      return total;
    }
   
    const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    return ( 
      <Fragment>
          <div className={cx('wrapper')} style={{position:'relative'}}>
            
              <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{color:'#fff', display:'flex', alignItems:'center', position:'absolute !important', right:'10px', top:'5px'}}
                >
                  <span style={{fontSize:'12px'}}>{userName}</span>
                  <MenuOutlined size="small" sx={{marginLeft:'10px'}}/>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={()=>navigate('/reception')}>Lễ tân</MenuItem>
              <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
            </Menu>
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
                                          backgroundColor:table.status === 1 &&  '#c2e0ff', border:"none", borderRadius:'10px', alignItems:'center'}}
                                          onClick={()=>handleSelectedTable(table)} className={cx('table-list_item', {selected: table.id === currentSelectedTable.tableId})}>
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

                                    <TabContent value={menuGroup} index={menu_group.id} id={`menu-tab-${menu_group.id}`} key={menu_group.id}>
                                      <Stack spacing={2} useFlexGap={true} direction="row" flexWrap="wrap"> 
                                      {listMenu.reduce((newMenus, menu)=>{
                                        if(menu.is_active) return [...newMenus, menu];
                                        else return newMenus;
                                      }, [])
                                      .map(menu=>(
                                          <Button sx={{fontSize:"10px", display:'flex', flexDirection:'column', padding:0, width:'22.5%', height:'180px'}} 
                                          variant='outlined' size="small" key={menu.id} onClick={()=>handleSelectMenu(menu)}
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
                                            <div style={{padding:'10px 5px',  backgroundColor:'#f5f5f6', width:'100%', color:'#111',height:'calc(100% - 120px)'}}>
                                              <p style={{fontSize:'11px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{menu.name}</p>
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
                          {listOrder.length > 0 && 
                              <Tabs
                                value={currentOrderTab}
                                onChange={(e, newValue)=>{setCurrentOrderTab(newValue)}}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                                sx={{'button': {fontSize:'12px'}, '.MuiBox-root':{padding:0}}} 
                              >
                                {listOrder.length > 0 && listOrder.map((order, index)=>(
                                    <Tab key={index}  id={`order-tab-${index}`} aria-controls={`order-tabpanel-${index}`} 
                                    label={<p style={{display:'flex', alignItems:'center'}}>{order.order_code} 
                                    <Close fontSize="small" onClick={(e)=>handleCancelTab(e, index, order)} sx={{color:'#111', marginLeft:'5px'}}/></p>} 
                                      value={index}/>
                                ))}
                              </Tabs>
                          }
                        </Box>
                        <Button size="small" variant="contained" color='primary' onClick={handleAddNewTab}
                        sx={{minWidth:'30px', height:'30px', borderRadius:'50%', padding:0, marginLeft:'10px'}}>
                          <Add fontSize="small"/>
                        </Button>
                      </Stack>
                      {/* TAB CONTENT */}
                      <div style={{height:'498px'}}>
                        {listOrder.length > 0 && listOrder.map((order, index)=>(
                          <CustomTabContent order={order} currentOrderTab={currentOrderTab} id={index} key={index} onToggleNoteDialog={handleToggleNoteDialog}/>
                        ))}
                      </div>

                      <div style={{width:'100%', backgroundColor:'#e6f0fa', height:'100px', borderRadius:'20px', padding:'10px'}}>
                        <Stack direction="row" sx={{width:'100%'}}>
                          <Grid container spacing={1}>
                            <Grid item xs={3}>
                              <Select
                                
                                // onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{width:'100%', fontSize:'13px', '.MuiSelect-select':{padding:'7px 10px'},
                                borderRadius:'20px', bgcolor:'#dde7f1', 'fieldset':{border:0}}}
                                size='small'
                                defaultValue={1}
                              >
                                <MenuItem value={1} sx={{fontSize:'13px'}}>
                                  <em>{userName}</em>
                                </MenuItem>
                               
                                
                              </Select>
                              
                            </Grid>
                            <Grid item xs={2} sx={{textAlign:'center'}}>
                              <IconButton size="small" sx={{borderRadius:"20px", backgroundColor:'#dde7f1', padding:'6px 12px'}} onClick={()=>setOpenClientQuantityDialog(true)} disabled={listOrder.length <= 0 ? true : false}>
                                <Groups fontSize="small"/>
                                <span style={{fontSize:'15px', fontWeight:'600', marginLeft:'5px'}}>{listOrder.length > 0 ? listOrder[currentOrderTab].client_quantity : 0}</span>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} sx={{textAlign:'left'}}>
                              <IconButton size="small" sx={{borderRadius:"20px", backgroundColor:'#dde7f1', padding:'6px'}} disabled={listOrder.length <= 0 ? true : false}
                              onClick={(e)=>handleToggleNoteDialog(e,'order', listOrder[currentOrderTab].id  ? listOrder[currentOrderTab].id : listOrder[currentOrderTab].order_code, listOrder[currentOrderTab].order_note)}>
                                <Mode fontSize="small"/>
                              </IconButton>
                            </Grid>
                            <Grid item xs={5} sx={{textAlign:'right', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                              <p style={{fontWeight:'600', marginRight:'10px'}}>Tổng tiền:</p>
                              <p style={{fontSize:'20px', fontWeight:600}}>{listOrder[currentOrderTab] && calcMoney(listOrder[currentOrderTab].order_menu)}</p>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack direction="row" sx={{marginTop:'10px'}} justifyContent="center">
                            <Grid item xs={6} >
                              <Button variant='contained' color='success' sx={{width:'100%'}} onClick={()=>setOpenPaymentDialog(true)} disabled={listOrder.length === 0 ? true : false}>
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
        {openClientQuantityDialog &&  <ClientQuantityDialog   openDialog={openClientQuantityDialog} onCloseDialog={()=>setOpenClientQuantityDialog(false)} order={listOrder[currentOrderTab]}  />}
          <NewItemDialog openDialog={openNewItemDialog} onCloseDialog={()=>setOpenNewItemDialog(false)}/>
          <NewClientDialog openClientDialog={newClientDialog} onCloseClientDialog={()=>setNewClientDialog(false)}/>
          {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
          
          {listOrder[currentOrderTab] && <PaymentDialog openDialog={openPaymentDialog} onCloseDialog={()=>setOpenPaymentDialog(false)} order={listOrder[currentOrderTab]} userName={userName} setCurrentOrderTab={setCurrentOrderTab}/>}
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
          tableName: table_name, 
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
  const [state, dispatch] = useStore();
  const [showAlert, setShowAlert] = useState();
  const [alertMessage, setAlertMessage] = useState({});
  const {listOrder} = state;
  const handleChangeNote = (e)=>{
    if(data.type !== 'order_menu'){
      setCurrentNote(prev=>({...prev, note:e.target.value}))
    }
    else 
      setCurrentNote(prev=>({...prev, note:{order_menu_id:data.note.order_menu_id, order_menu_note: e.target.value}}))
  }
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
      else if(data.type === "order_menu"){
        const result = await axios.put(`http://localhost:4049/api/order/update`, 
          {
            order_id: data.id, 
            order_menu: {
              order_menu_id: data.note.order_menu_id, 
              order_menu_note: data.note.order_menu_note
            }
          }  
      )
        if(result.data.status === 'success')
        {
            const newListOrder = await axios.get('http://localhost:4049/api/order');
            dispatch(actions.setListOrder(newListOrder.data));
        }
        setAlertMessage({status:result.data.status, message: result.data.message});
        setShowAlert(true);
      }
      else if(data.type === 'order'){
        //id !== null, order đã được lưu lên DB 
        console.log(data);
        //nếu data.id chứa tiền tố HD => order chưa được lưu vào DB nên chưa có id, phải dùng đến order_code
        if(!data.id.toString().includes('HD')){
          const result = await axios.put(`http://localhost:4049/api/order/update-note`, data)
          if(result.data.status === 'success')
          {
              const newListTable = await axios.get('http://localhost:4049/api/order');
              dispatch(actions.setListOrder(newListTable.data));
          }
            setAlertMessage({status:result.data.status, message: result.data.message});
            setShowAlert(true);
        } 
        // id === null, order chưa được lưu vào DB
        else {
          const newListOrder = listOrder.map(orderItem=>{
            if(orderItem.order_code === data.id){
              orderItem.note = data.note;
            }
            return orderItem;
          })
          dispatch(actions.setListOrder(newListOrder));
        }
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
        <DialogTitle fontSize="17px">Ghi chú</DialogTitle>
        <DialogContent>
         <Input fullWidth={true} startAdornment={<BorderColorOutlined fontSize='small'/>}  onChange={handleChangeNote} value={data.type === 'order_menu' ? data.note.order_menu_note : data.note}/>
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

function ClientQuantityDialog({openDialog, onCloseDialog,order})
{
  const [state, dispatch] = useStore();
  const [showAlert, setShowAlert] = useState();
  const [alertMessage, setAlertMessage] = useState({});
  const [clientQuantity ,setClientQuantity] = useState(order.client_quantity)
  const {listOrder} = state;
  const handleSaveNote = async ()=>{
    try 
    {
      const newListOrder = listOrder.map(orderItem=>{
        if(orderItem.order_code === order.order_code)
          orderItem.client_quantity = clientQuantity;
        return orderItem;
      })
      dispatch(actions.setListOrder(newListOrder))
      onCloseDialog();
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
        <DialogTitle fontSize="17px">Số lượng khách</DialogTitle>
        <DialogContent>
         <Input fullWidth={true} startAdornment={<BorderColorOutlined fontSize='small'/>}  onChange={(e)=>setClientQuantity(e.target.value)} value={clientQuantity} placeholder='Nhập số lượng'/>
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
const  PaymentDialog = memo(({openDialog, onCloseDialog,order, userName, setCurrentOrderTab})=>
{
  const [state,dispatch] = useStore();
  const navigate = useNavigate();
  const [discountUnit, setDiscountUnit] = useState('cash');
  const [valueMoney, setValueMoney] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [alertMessage, setAlertMessage] = useState({status:'', message:''});
  const [showAlert, setShowAlert] = useState(false);
  const pdfRef = useRef();
  const handleChangeDiscountUnit = (event, unit) => {
    setDiscountUnit(unit);
  };
  const handleCreatePDF = UseReactToPrint({
    content:()=>pdfRef.current ,
    suppressErrors: true, 
    documentTitle:'payment', 
    onAfterPrint:()=>{
      setShowPDF(false)
      onCloseDialog();
    }
  })
  const [typePayment, setTypePayment] =useState('');

  const calcMoney = (order_menu)=>{
    var total =0;
    order_menu.forEach(orderMenuItem=>{
      total = total + (orderMenuItem.order_menu_price * orderMenuItem.order_menu_quantity);
    })
    return total;
  }
  const discount = (money)=>{
    if(discountUnit === 'cash')
      return money - valueMoney;
    else if(discountUnit === 'percent')
      return money * (100 - valueMoney)/100;
  }
  const handleChangeTypePayment = async (event) => {
   try 
   {
    if(event.target.value === 'momo'){
      const result = await axios.post('http://localhost:4049/payment', {amount:discount(calcMoney(order.order_menu))});
      window.open(result.data.order_url, '_blank');
      console.log(result);
    }
    setTypePayment(event.target.value);
   }
   catch(error){
    console.log(error)
   }

  };

  const handePrintPDF = async ()=>{
    try 
    {
      const result = await axios.put('http://localhost:4049/api/order/update-status', {id: order.id});
      if(result.data.status === 'success'){
        setShowPDF(true);
        setTimeout(async ()=>{
          handleCreatePDF();
          setCurrentOrderTab(prev=>prev-1 >=0 ? prev -1 : 0)
          //update trạng thái table
          await axios.put('http://localhost:4049/api/table/update-status', {table_id: order.table_id, status: 0});
          //update trạng thái booking
          const bookingCode = order.booking_code;
          //order được tạo từ phiếu booking
          if(bookingCode !== null){
            await axios.put('http://localhost:4049/api/booking/update-status', {status:6, booking_code: bookingCode});
          }
          const newListOrder = await axios.get('http://localhost:4049/api/order');
          dispatch(actions.setListOrder(newListOrder.data));
        }, 500)
       
        
      }
      else {

      }
    }
    catch(error)
    {

    }
  }
  
  const pdfData = ()=>
    {
      return {
        order_code: order.order_code, 
        client_id :order.client_id, 
        employee: userName, 
        order_menu: order.order_menu, 
        total: discount(calcMoney(order.order_menu))
      }
    }
  return (
    <Fragment>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={onCloseDialog}
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px", 
              maxHeight:'100vh',
              height:'100%' , 
              borderRadius:0
            },
          },
        }}
        PaperProps={{sx:{position:'fixed', right:'-32px', top:'-32px'}}}
      >
        <DialogTitle fontSize="17px" display="flex" flexDirection="row"  alignItems="center">
          <p style={{fontWeight:500}}>Phiếu thanh toán - {order.order_code}</p>
          <Circle size="small" color='primary' sx={{width:'10px', height:'10px', margin:'0 10px'}}/>
          <p style={{color:'#0066CC', fontWeight:500}}>{order.table_name} / Tầng {order.area}</p>
        </DialogTitle>
        <DialogContent>
         <Grid container spacing={4} >
          <Grid item xs={8} >
          <TableContainer >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell  align="left">Mã món</TableCell>
                  <TableCell align="left">Tên món</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="left">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.order_menu.map((orderMenuItem, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell  align="left">
                      {orderMenuItem.order_menu_id}
                    </TableCell>
                    <TableCell align="left">
                      <h4 style={{fontWeight:500}}>{orderMenuItem.order_menu_name}</h4>
                      <p style={{fontSize:'12px', maxWidth:'200px', whiteSpace:'pre-line',
                       whiteSpaceCollapse:'preserve-breaks', textWrap:'wrap', wordBreak:'break-word' }}>
                        {order.order_menu_note}
                      </p>
                    </TableCell>
                    <TableCell align="left">{orderMenuItem.order_menu_quantity}</TableCell>
                    <TableCell align="left">{orderMenuItem.order_menu_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          </Grid>
          <Grid item xs={4}>
            <Grid container marginBottom="10px" sx={{display:'flex', alignItems:'center', flexDirection:'row'}}>
              <Grid item xs={6} display="flex" alignItems="flex-end" marginRight="10px">
                <p style={{fontSize:'14px', fontWeight:'600'}}>Tổng tiền hàng</p>
              </Grid>
              <Grid item xs={5}>
                <h3 style={{textAlign:'right'}}>{calcMoney(order.order_menu)}</h3>
              </Grid>
            </Grid>

            <Grid container marginBottom="20px">
              <Grid item xs={5} display="flex" alignItems="flex-end">
                <p style={{fontSize:'14px', fontWeight:'600'}}>Giảm giá ({discountUnit ==='cash' ? 'VND' : '%'})</p>
              </Grid>
              <Grid item xs={7}>
                <Input fullWidth={true} onChange={e=>setValueMoney(e.target.value)}endAdornment={
                <ToggleButtonGroup
                color="primary"
                value={discountUnit}
                exclusive
                onChange={handleChangeDiscountUnit}
                aria-label="Platform"
                size='small'
                sx={{'button':{padding:'5px 10px'}, 'svg':{fontSize:'14px'}}}
              >
                <ToggleButton value="percent" >
                  <Percent />
                </ToggleButton>
                <ToggleButton value="cash" >
                  <Payments  />
                </ToggleButton>
              </ToggleButtonGroup>
                }/>
              </Grid>
            </Grid>

            <Grid container marginBottom="20px">
              <Grid item xs={6} display="flex" alignItems="flex-end">
                <p style={{fontSize:'14px', fontWeight:'600'}}>Khách cần trả</p>
              </Grid>
              <Grid item xs={6}>
                <h3 style={{textAlign:'right'}}>{discount(calcMoney(order.order_menu))}</h3>
              </Grid>
            </Grid>

            <Grid container marginBottom="20px">
            <Grid item xs={4} display="flex" alignItems="center">
              <p style={{fontSize:'14px', fontWeight:'600'}}>Thanh toán</p>
            </Grid>
              <Grid item xs={8} display="flex" alignItems="flex-end">
                  <Select
                  value={typePayment}
                  onChange={handleChangeTypePayment}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  fullWidth={true} 
                  size="small"
                  sx={{'.MuiSelect-select':{display:'flex', alignItems:'center'}, fontSize:'14px'}}
                >
                  <MenuItem value="" sx={{fontSize:'14px'}}>
                    <em>-- Thanh Toán -- </em>
                  </MenuItem>
                  <MenuItem value="cash" sx={{fontSize:'14px'}}>Tiền mặt</MenuItem>
                  <MenuItem value="momo" sx={{fontSize:'14px'}}>
                    <img src={zlpay} alt="" width="25px" style={{marginRight:'10px'}}/>
                    Zalo - Pay
                    </MenuItem>
                </Select>
              </Grid>
             
            </Grid>

            <Grid container >
              <Grid item xs={12} display="flex" alignItems="flex-end" justifyContent="center">
                <Button variant="contained" color="success"  onClick={handePrintPDF}>
                  <MonetizationOnOutlined sx={{marginRight:'10px'}}/>
                  Thanh Toán
                  </Button>
              </Grid>
             
            </Grid>

          </Grid>

         </Grid>
        </DialogContent>
      </Dialog>
      {showPDF && <PaymentPDF ref={pdfRef} data={pdfData()}/>}
      {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
    </Fragment>
  )
})
export default Cashier;