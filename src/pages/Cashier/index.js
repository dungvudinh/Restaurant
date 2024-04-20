import { useState } from 'react';
import { Grid } from '@mui/material';
import styles from './Cashier.module.scss';
import classNames from 'classnames/bind';
import {Box, Typography, Tab, Tabs} from '@mui/material';
const cx  = classNames.bind(styles);

function Cashier() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return ( 
        <div className={cx('wrapper')}>
            <Grid container spacing={2} sx={{width:'100%', margin:0, height:'calc(100vh - 40px)'}}>
                <Grid item xs={6} className={cx('left-wrapper')}>
                    <div className={cx('left-content')}>
                        <div className={cx('tab-header')}>
                            <Box sx={{fontSize:'10px' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{'button': {fontSize:'12px'}}} >
                                    <Tab label="Phòng bàn" {...a11yProps(0)} />
                                    <Tab label="Thực đơn" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabContent value={value} index={0}>
                                Item One
                            </TabContent>
                            <TabContent value={value} index={1}>
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
            <Typography>{children}</Typography>
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
export default Cashier;