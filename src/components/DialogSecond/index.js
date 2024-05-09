import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from './DialogSecond.module.scss';
import { DialogTitle, Dialog, DialogContent,Typography, DialogActions, Button, IconButton,
Tab, Box, Tabs, Stack } from "@mui/material";
import {Close, TableBar, TaskAlt, Block} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import axios from "axios";

const cx = classNames.bind(styles);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

function DialogSecond({onCloseDialogSec, openDialogSec, dataSelectedId, onChangeInput}) {
    const [currentArea, setCurrentArea] = useState(0);
    const [listTableSelected, setListTableSelected] = useState([]);
    const [listArea, setListArea] = useState([]);
    const [listTable, setListTable] = useState([]);
    useEffect(()=>
    {
        axios.get('http://localhost:4049/api/area')
        .then(response=>setListArea(response.data))
    }, [])

    useEffect(()=>{
        axios.get(`http://localhost:4049/api/table?area_id=${currentArea+1}`)
        .then(response=>setListTable(response.data))
    }, [currentArea])
    useEffect(()=>{
        setListTableSelected(dataSelectedId);
    }, [dataSelectedId.length])
    
    const handleChangeArea = (event, newValue) =>setCurrentArea(newValue);
    const handleSelectIndex = ({id, name})=>
        {
            if(listTableSelected.some(table=>table.id === id))
                setListTableSelected(prev=>prev.filter(table=>table.id !== id))
            else 
                setListTableSelected(prev=>[...prev, {id, name}])
        }
    const handleSaveChosen = ()=>{
        onChangeInput('tables',listTableSelected);
        onCloseDialogSec();
    }

    
    return (
        <BootstrapDialog
        onClose={onCloseDialogSec}
        aria-labelledby="customized-dialog-title"
        open={openDialogSec}
        fullWidth={true}
        maxWidth="md"
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Danh sách phòng/bàn trống
            </DialogTitle>
            <IconButton
            aria-label="close"
            onClick={onCloseDialogSec}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <Close />
            </IconButton>
            <DialogContent dividers >
                <div className={cx('content-header')}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentArea} onChange={handleChangeArea} aria-label="basic tabs example" sx={{'button':{fontSize:'12px'}}}>
                            {listArea.length > 0 && listArea.map(area=>(
                                <Tab label={area.name} {...a11yProps(area.area_id)} key={area.id}/>
                            ))}
                        </Tabs>
                    </Box>
                </div>
                <div className="content-container">
                    {listArea.length > 0 && listArea.map(area=>(
                        <CustomTabPanel value={currentArea} index={area.area_id - 1} key={area.id}   >
                            <Stack  direction="row" flexWrap="wrap" spacing={2}>
                                {listTable.length > 0 && listTable.map((table,  index)=>(
                                    <Button key={table.id} variant="outlined" size="small" sx={{padding:'10px 20px',  display:'flex', flexDirection:'column'}} 
                                    disabled={table.status === 1}
                                        onClick={()=>handleSelectIndex({id:table.id, name:table.name, status: table.status})} className={cx('table-btn', {selected: listTableSelected.some(item=>item.id === table.id)})}>
                                            <p style={{fontSize:'12px'}}>{table.name}</p>
                                            <span style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <TableBar />
                                                <p>{table.chair_quantity}</p>
                                            </span>
                                    </Button>
                                ))}
                            </Stack>
                        </CustomTabPanel>
                    ))}
                    
                    
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSaveChosen} variant='contained' fontSize="15px" size='small' 
                sx={{display:'flex', alignItems:'center'}}>
                    <TaskAlt fontSize='small' sx={{marginRight:'5px'}}/>
                    <p style={{marginTop:'3px'}}>chọn</p>
                </Button>
                <Button autoFocus onClick={onCloseDialogSec} variant='outlined' fontSize="15px" size="small">
                    <Block fontSize='small' sx={{marginRight:'5px'}}/>
                    <p style={{marginTop:'3px'}}>bỏ qua</p>
                </Button>
            </DialogActions>
        </BootstrapDialog>
     );
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
export default DialogSecond;