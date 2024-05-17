import {useState, useEffect} from 'react';
import axios from 'axios';
import { Stack, Grid, Button, OutlinedInput, IconButton, List, ListItem, ListItemButton, ListItemIcon,ListItemText, Box,
Chip} from '@mui/material';
import { TableBar, Search, Add, AccountCircleOutlined, Delete, ContentPaste, Remove} from '@mui/icons-material';
import NewClientDialog from '../NewClientDialog';
import {useStore, actions}  from '../../store';



function CustomTabContent({order, currentOrderTab, id, onToggleNoteDialog}) {
    const [state, dispatch] = useStore();
    const [newClientDialog, setNewClientDialog] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [currentSelectedClient, setCurrentSelectedCient]  = useState(null);
    const [listOrderMenu, setListOrderMenu] = useState([]);
    const { listOrder } = state;
    const [initUpdateQuantity, setInitUpdateQuantity] = useState({
        order_id: order.id, 
        order_menu_id:null, 
        order_menu_quantity : null 
    })
   
    useEffect(()=>{
        if(currentSelectedClient !== null && currentSelectedClient.client_id !== listOrder[currentOrderTab].client_id){
            listOrder[currentOrderTab].client_id = currentSelectedClient.client_id;
            listOrder[currentOrderTab].full_name = currentSelectedClient.full_name;
            listOrder[currentOrderTab].client_code = currentSelectedClient.client_code;
            listOrder[currentOrderTab].phone_number = currentSelectedClient.phone_number;
            dispatch(actions.setListOrder(listOrder));
            if(order.order_menu.length > 0){
                axios.put('http://localhost:4049/api/order/update-other', listOrder[currentOrderTab])
            }

        }
        
    }, [order.order_menu.length, currentSelectedClient])
    useEffect(()=>{
        if(order.client_id === null)
            setCurrentSelectedCient(null);
        else 
            setCurrentSelectedCient({
                client_id: order.client_id, 
                full_name: order.full_name, 
                client_code: order.client_code,
                phone_number: order.phone_number
            })
    },[])
    useEffect(()=>{
        setListOrderMenu(order.order_menu)
    }, [order.order_menu])
    useEffect(()=>{ 
        if(searchValue !== '')
        {
            var timer = setTimeout(()=>{
                axios.get(`http://localhost:4049/api/client?name=${searchValue}`)
                .then(res=>{
                    console.log(res.data)
                    setSearchResult(res.data)
                })
            }, 1000)
            return ()=> clearTimeout(timer);
        }
        else 
            setSearchResult([]);
    }, [searchValue])
    useEffect(()=>{
        if(initUpdateQuantity.order_menu_quantity)
        {
            var timer = setTimeout(()=>{
                axios.put(`http://localhost:4049/api/order/update-quantity`,initUpdateQuantity)
                
            }, 500)
            return ()=>clearTimeout(timer);
        }
    }, [initUpdateQuantity.order_menu_quantity])
   
    const handleSearch = (e)=>setSearchValue(e.target.value)
    const handleIncreaseQuantity = (index,order_menu_id,  quantity)=>{
        const updateListOrderMenu = [...listOrderMenu];
        updateListOrderMenu[index] = {...updateListOrderMenu[index], order_menu_quantity: quantity}
        setListOrderMenu(updateListOrderMenu)
        setInitUpdateQuantity(prev=>({...prev, order_menu_id:order_menu_id,order_menu_quantity: quantity  }))
        listOrder[currentOrderTab] = {...listOrder[currentOrderTab], order_menu:updateListOrderMenu};
        dispatch(actions.setListOrder(listOrder));
    }
    const handleDecreaseQuantity = (index,order_menu_id,  quantity)=>{
        const updateListOrderMenu = [...listOrderMenu];
        updateListOrderMenu[index] = {...updateListOrderMenu[index], order_menu_quantity: quantity}
        setListOrderMenu(updateListOrderMenu)
        setInitUpdateQuantity(prev=>({...prev, order_menu_id:order_menu_id,order_menu_quantity: quantity }))
    }
    const handleDeleteOrderMenu = async (order_menu_id)=>{
        try 
        {
            await axios.delete('http://localhost:4049/api/order/delete-menu', {data:{order_menu_id, order_id: order.id}})
            const newListOrder = await axios.get("http://localhost:4049/api/order");
            dispatch(actions.setListOrder(newListOrder.data));
        }
        catch(error)
        {
            console.log(error);
        }
    }
    const handleRemoveClient = ()=>{
        listOrder[currentOrderTab].client_id = null;
        listOrder[currentOrderTab].full_name = null;
        listOrder[currentOrderTab].client_code = null;
        listOrder[currentOrderTab].phone_number = null;
        setCurrentSelectedCient(null);
    }
    return ( 
        <>
            <TabContent value={currentOrderTab} index={id} id={`order-tab-${id}`}>
            <Stack>
                <Grid container sx={{display:'flex',alignItems:'center'}}>
                <Grid item xs={4}>
                    <Button variant="outlined" sx={{fontSize:'11px', borderRadius:'20px', cursor:'pointer'}}size="small">
                        <TableBar sx={{marginRight:'5px'}} fontSize="small"/>
                        <p style={{marginTop:'2px'}}>
                            {
                                order.table_id ? 
                                    `${order.table_name} / Tầng ${order.area}`
                                : 
                                'Chưa chọn bàn'
                            }
                        </p>
                    </Button>
                </Grid>
                <Grid item xs={5} sx={{position:'relative', height:'40px'}}>
                    {
                        (currentSelectedClient !== null) 
                        ? 
                         (
                            <Chip sx={{position:'absolute', top:'50%',transform:'translate(-50%, -50%)',
                            left:'50%', zIndex:'10', width:'100%', overflow:'hidden', padding:'19px 0', borderRadius:'20px',
                            backgroundColor:'#f5f5f6', color:'#006fd3'}}
                                label={`${currentSelectedClient.full_name} - ${currentSelectedClient.client_code}`} 
                                onDelete={handleRemoveClient} icon={<AccountCircleOutlined fontSize='small'/>}
                            />
                         )
                         :
                         (
                            <OutlinedInput  size="small" 
                            sx={{borderRadius:'50px', backgroundColor:'#fff', paddingLeft:'7px', 
                            paddingRight:'7px', fontSize:'14px', width:'100%', 'input':{padding:'9px 0'}}} 
                            startAdornment={<Search color='primary' fontSize='small' sx={{marginRight:'10px'}}/>} 
                            endAdornment={<IconButton sx={{backgroundColor:"#fff"}} size="small" onClick={()=>setNewClientDialog(true)}><Add fontSize='small'/></IconButton>}
                            onChange={handleSearch} placeholder='Tìm khách hàng' required/>
                         )
                    }
                    {searchResult.length > 0 && searchResult.map((client, index)=>(
                        <div key={client.id} style={{position:'absolute', width:'250px', backgroundColor:'white',
                            borderRadius:'8px', maxHeight:'250px', boxShadow:'0 5px 8px rgba(0, 0, 0, 0.35)', overflow:'auto', zIndex:'10'}}>
                            <List>
                            <ListItem disablePadding sx={{fontSize:'10px'}}>
                                <ListItemButton onClick={()=>{setCurrentSelectedCient({client_id: client.id, full_name: client.full_name, client_code: client.client_code, phone_number: client.phone_number}); setSearchResult([])}}>
                                    <ListItemIcon>
                                    <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={client.full_name}  secondary={<span>{client.client_code}<br/>{client.phone_number}</span>}
                                    sx={{'.MuiListItemText-primary ':{fontSize:'14px',fontWeight:'600'},
                                    '.MuiListItemText-secondary ':{fontSize:'12px'}}}/>
                                </ListItemButton>
                            </ListItem>
                            
                            </List>
                        </div>
                    ))}
                </Grid>
                </Grid>
            </Stack>
            {/* DANH SÁCH MÓN ĂN ĐÃ CHỌN */}  
            <List sx={{width:'100%', marginTop:'10px', height:'400px', overflow:'auto'}}>
                {listOrderMenu && listOrderMenu.length > 0 && listOrderMenu.map((orderMenuItem, index)=>(
                <ListItem key={index} disablePadding sx={{borderRadius:'10px', border:'1px solid transparent', 
                boxShadow:'0px 4px 10px rgba(0, 0, 0, 0.1)', padding:'10px', 
                '.MuiListItemText-primary ':{fontSize:'14px',fontWeight:'600'}, '.MuiListItemText-secondary':{fontSize:'13px'}}}>
                    <ListItemIcon>
                        <IconButton size='small' color="error" onClick={()=>handleDeleteOrderMenu(orderMenuItem.order_menu_id)}>
                            <Delete fontSize="small"/>
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText primary={orderMenuItem.order_menu_name} sx={{width:'200px'}}
                    secondary={<span style={{display:'flex', alignItems:'center'}}><ContentPaste sx={{marginRight:'5px', fontSize:'14px'}} fontSize="small"/>
                    <span style={{maxWidth:'100px', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap', cursor:'pointer'}}
                    onClick={(e)=>onToggleNoteDialog(e, 'order_menu',order.id, {order_menu_id:orderMenuItem.order_menu_id, order_menu_note:orderMenuItem.order_menu_note})}>
                        {orderMenuItem.order_menu_note || 'Nhập ghi chú món'}
                        </span></span>}/>
                    <ListItemText primary={
                        <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton size="small" sx={{border:'1px solid black'}} onClick={()=>handleIncreaseQuantity(index, orderMenuItem.order_menu_id, orderMenuItem.order_menu_quantity +1)}>
                            <Add fontSize="small"/>
                        </IconButton>
                            <span>{orderMenuItem.order_menu_quantity}</span>
                        <IconButton size="small" sx={{border:'1px solid black'}} onClick={()=>handleDecreaseQuantity(index, orderMenuItem.order_menu_id, orderMenuItem.order_menu_quantity -1 < 1 ? 1 :orderMenuItem.order_menu_quantity -1 )}>
                            <Remove fontSize="small"/>
                        </IconButton>
                        </Stack>
                        }
                        />
                    <ListItemText primary={
                        <span style={{fontWeight:'500'}}>{orderMenuItem.order_menu_price}đ</span>
                    }/>
                </ListItem>
                ))}
                
            </List>
            </TabContent>
            <NewClientDialog openClientDialog={newClientDialog} onCloseClientDialog={()=>setNewClientDialog(false)} setCurrentSelectedCient={setCurrentSelectedCient}/>
        </>
     );
}

export default CustomTabContent;

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