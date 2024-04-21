import { useState, Fragment } from 'react';
import { Grid } from '@mui/material';
import styles from './Cashier.module.scss';
import classNames from 'classnames/bind';
import {Box, Tab, Tabs, IconButton, Stack, Button,Dialog, DialogTitle
, DialogContent, DialogActions, Input} from '@mui/material';
import { Search,Close, TextFields } from '@mui/icons-material';
const cx  = classNames.bind(styles);

function Cashier() {
    const [tabValue, setTabValue] = useState(0);
    const [roomValue, setRoomValue] = useState(0);
    const [openSearch, setOpenSearch] = useState(false);
    
    return ( 
      <Fragment>

          <div className={cx('wrapper')}>
              <Grid container spacing={2} sx={{width:'100%', margin:0, height:'calc(100vh - 40px)'}}>
                  <Grid item xs={6} className={cx('left-wrapper')}>
                      <div className={cx('left-content')}>
                          <div className={cx('tab-header')}>
                              <Box sx={{fontSize:'10px' }}>
                                  <Tabs value={tabValue} onChange={(e, newValue)=> setTabValue(newValue)}  sx={{'button': {fontSize:'12px'}, '.MuiBox-root':{padding:0}}} >
                                      <Tab label="Phòng bàn" {...a11yProps(0)} />
                                      <Tab label="Thực đơn" {...a11yProps(1)} />
                                  </Tabs>
                              </Box>
                              <TabContent value={tabValue} index={0} sx={{'.MuiBox-root':{padding:0}}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Tabs value={roomValue} onChange={(e, newValue)=>setRoomValue(newValue)}
                                  sx={{'button': {fontSize:'10px'}}} >
                                    <Tab label="Tất cả " id='room-tab-1' aria-controls='room-tabpanel-1' />
                                    <Tab label="Tầng 1" id='room-tab-2' aria-controls='room-tabpanel-2' />
                                    <Tab label="Tầng 2" id='room-tab-3' aria-controls='room-tabpanel-3' />
                                  </Tabs>
                                  <IconButton size="small" onClick={()=>setOpenSearch(true)}>
                                    <Search fontSize="small" color='primary'/>
                                  </IconButton>
                                </Stack>
                              </TabContent>
                              <TabContent value={tabValue} index={1}>
                                  Item Two
                              </TabContent>
                              
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={6} className={cx('right-wrapper')}>
                    <div className={cx('right-content')}></div>
                  </Grid>
              </Grid>
          </div>
          <SearchPopup openSearch={openSearch} onCloseSearch={()=>setOpenSearch(false)}/>
      </Fragment>
     );
}

function TabContent(props) {
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

function SearchPopup({openSearch, onCloseSearch})
{
  return (
    <Fragment>
      <Dialog
        open={openSearch}
        onClose={onCloseSearch}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title" sx={{fontSize:'17px'}}>
          <form action="" >
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextFields size="small" sx={{fontSize:'15px'}} fullWidth={true}
                  startAdornment={<Search fontSize="small" sx={{marginRight:'10px'}}/>} variant="outlined"/>
                </Grid>
                <Grid item xs={3}>
                  <Button variant="outlined" color="primary" type="submit" size='small' sx={{fontSize:"12px"}}>Tìm kiếm</Button>
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
        <DialogContent dividers>
            
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={onCloseSearch}>Disagree</Button>
          <Button onClick={onCloseSearch} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </Fragment>
  )
}
export default Cashier;