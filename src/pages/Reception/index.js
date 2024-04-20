import { Fragment, useState } from "react";
import classNames from "classnames/bind";
import styles from './Reception.module.scss';
import Sidebar from "../../components/Sidebar";
import DataTable  from '../../components/DataTable';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import {ArrowForward, EditCalendar} from '@mui/icons-material';
import {Grid,Box, FormGroup, FormControlLabel, Checkbox, Button, Stack} from '@mui/material';
import CustomizedDialog from "../../components/Dialog";

const cx = classNames.bind(styles);


function Reception() {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = ()=>setOpenDialog(true);
    const handleCloseDialog = ()=>setOpenDialog(false);
    return ( 
        <Fragment>

            <Box sx={{flexGrow:1}}>
                <Grid className={cx('wrapper')} container > 
                    <Grid className={cx('sidebar')} item xs={2}>
                        <Sidebar />
                    </Grid>
                    <Grid className={cx('container')} item xs={10}>
                        <Stack direction="row" justifyContent="space-between" style={{padding:'20px'}}>
                            <div className={cx('tabs-header')}>
                                <FormGroup sx={{display:'flex', flexDirection:'row'}}>
                                    <FormControlLabel control={<Checkbox defaultChecked color="warning" sx={{color:'#FF9900'}} size="small"/>} label="Chờ xếp bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                                    <FormControlLabel control={<Checkbox defaultChecked color="success" sx={{color:'#28B44F'}} size="small"/>} label="Đã xếp bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                                    <FormControlLabel control={<Checkbox defaultChecked color="primary"  sx={{color: '#0066CC'}} size="small"/>} label="Đã nhận bàn" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                                    <FormControlLabel control={<Checkbox defaultChecked sx={{color: pink[800],'&.Mui-checked': {color: pink[600]}}} size="small"/>} label="Đã hủy" 
                                    sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                                </FormGroup>
                            </div>

                            <Stack spacing={2} direction="row">
                                <Button variant="outlined" size="small" sx={{fontSize:'12px'}}>
                                    <ArrowForward fontSize="small" sx={{marginRight:'5px'}}/>
                                    Xuất file
                                </Button>
                                <Button variant="contained" size="small" sx={{fontSize:'12px'}} onClick={handleOpenDialog}>
                                    <EditCalendar fontSize="small" sx={{marginRight:'5px'}}/>
                                    Đặt bàn
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <DataTable />
                            
                        </Stack>
                      

                    </Grid>
                </Grid>
            </Box>
            <CustomizedDialog onOpenDialog={handleOpenDialog} onCloseDialog={handleCloseDialog} isOpenDialog={openDialog}/> 
        </Fragment>
     );
}

export default Reception;