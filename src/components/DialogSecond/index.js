import { useState } from "react";
import classNames from "classnames/bind";
import styles from './DialogSecond.module.scss';
import { DialogTitle, Dialog, DialogContent,Typography, DialogActions, Button, IconButton,
Tab, Box, Tabs, Stack } from "@mui/material";
import {Close, TableBar, TaskAlt, Block} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const cx = classNames.bind(styles);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
const tables = [
    {
        name:'Bàn số 1', 
        quantity: 4
    }, 
    {
        name:'Bàn số 2', 
        quantity: 6
    }
]
function DialogSecond({onCloseDialogSec, openDialogSec}) {
    const [value, setValue] = useState(0);
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = (e)=>
    {
        const currentElm = e.currentTarget;
        currentElm.classList.toggle('selected');
        if(currentElm.classList.contains('selected'))
        {
            currentElm.style.backgroundColor = "#0066CC";
            currentElm.style.color = '#fff';
        }
        else 
        {
            currentElm.style.backgroundColor = "#fff";
            currentElm.style.color = '#0066CC';
        }
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
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{'button':{fontSize:'12px'}}}>
                            <Tab label="Tất cả" {...a11yProps(0)} />
                            <Tab label="Tầng 1" {...a11yProps(1)} />
                            <Tab label="Tầng 2" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                </div>
                <div className="content-container">
                    <CustomTabPanel value={value} index={0}>
                        <Stack  spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                            {tables.map((table, index)=>(
                                <Button key={index} variant="outlined" size="small" sx={{padding:'10px 20px',  display:'flex', flexDirection:'column'}} 
                                onClick={handleClick} className={cx('table-btn')}>
                                    <p style={{fontSize:'12px'}}>{table.name}</p>
                                    <span style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        <TableBar />
                                        <p>{table.quantity}</p>
                                    </span>
                                </Button>
                            ))}
                        </Stack>
                       
                       
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Item Three
                    </CustomTabPanel>
                </div>
            </DialogContent>
            <DialogActions>
            <Button autoFocus onClick={onCloseDialogSec} variant='contained' fontSize="15px" size='small' 
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
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
export default DialogSecond;