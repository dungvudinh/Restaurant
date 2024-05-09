import classNames from "classnames/bind";
import axios from 'axios';
import { useEffect, useState } from "react";
import styles from './Sidebar.module.scss';
import { Input, FormControlLabel, RadioGroup, Radio, FormGroup, Checkbox, Autocomplete, TextField} from '@mui/material';
import { Search } from "@mui/icons-material";
import {useStore, actions} from '../../store';

const cx  = classNames.bind(styles);
const top100Films = [
{ label: 'Bàn số 1', year: 1994 },
  { label: 'Bàn số 2', year: 1972 },
  { label: 'Bàn số 3', year: 1974 },
  { label: 'Bàn số 4', year: 2008 },

]

function Sidebar() {
    const [state, dispatch] = useStore();
    const [search, setSearch] = useState('');
    const [listTable ,setListTable] = useState([]);
    const [timeline, setTimeline] = useState({
        overtime: false, 
        coming:false
    })
    const { status, table_id} = state;
    useEffect(()=>{
        axios.get(`http://localhost:4049/api/table`)
        .then(response=>setListTable(response.data.map(data=>({id: data.id,name: data.name, status:data.status}))))
    }, [])
    useEffect(()=>{
        
        var timer = setTimeout(()=>{
            // dispatch(actions.setBookingCode(search))
            // dispatch(actions.filterBookingByCode())
            axios.get(`http://localhost:4049/api/booking`, {
                params: {
                booking_code : search, 
                status : status, 
                table_id, 
                timeline
                }
            })
            .then(response=>{
                dispatch(actions.setListBooking(response.data))
                dispatch(actions.setBookingCode(search))
                })
        }, 1000)
        return ()=>clearTimeout(timer);
    }, [search, table_id.length, timeline.overtime, timeline.coming])
    const handleChangeInput = (name, value)=>{
        dispatch(actions.setTableId(value.map(item=>item.id)))
    }
    const handleChangeTimeline = (e)=>{
        const {name, checked} = e.target;
        dispatch(actions.setTimeline(name, checked));
        setTimeline(prev=>({...prev, [name]: checked}))
    }
    return ( 
        <div className={cx('wrapper')}>
            <h2 className={cx('sidebar-header')}>Đặt bàn</h2>
            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Tìm kiếm</h5>
                    <div className={cx('input-wrapper')}>
                        <Search fontSize="small" className={cx('search-icon')} sx={{marginRight:'10px'}}/>
                        <Input autoFocus={true} placeholder="Theo mã đặt bàn" fullWidth={true} sx={{'input':{fontSize:'14px !important'}}}
                        onChange={(e)=>setSearch(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Thời gian đặt</h5>
                    <div className={cx('input-wrapper')}>
                        <RadioGroup defaultValue="all" name="radio-button-group" sx={{fontSize:12}}>
                            <FormControlLabel value="all" control={<Radio size="medium"/>} label="Toàn thời gian" sx={{'& .MuiFormControlLabel-label': {fontSize:'14px'}}}/>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Phòng bàn</h5>
                    <div className={cx('input-wrapper')}>
                        {/* <Input autoFocus={true} placeholder="Chọn phòng/bàn" fullWidth={true}/>
                         */}
                         {/* <Autocomplete multiple options={top100Films} fullWidth={true} getOptionLabel={(option)=>option.label}
                         renderInput={(params)=><TextField {...params} label="Chọn phòng/bàn" sx={{'.MuiFormLabel-root':{fontSize:'14px'}}} variant="standard"/>}
                         size="small" sx={{'& ~ .MuiAutocomplete-popper': {fontSize:'14px'}}}/> */}

                        <Autocomplete multiple  options={listTable} getOptionLabel={(option)=>`${option.name}`} fullWidth={true}
                        renderInput={(params)=><TextField {...params} variant="filled" size='small' name='tables'
                        sx={{'.MuiFormLabel-root':{fontSize:'14px'}}} label="Chọn phòng/bàn"/>}
                        size='small' sx={{'& ~ .MuiAutocomplete-popper': {fontSize:'14px'}}} 
                        onChange={(event, value)=>handleChangeInput('tables', value)} />
                    </div>
                </div>
            </div>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Lựa chọn hiển thị</h5>
                    <div className={cx('input-wrapper')}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={timeline.overtime} onChange={handleChangeTimeline} name="overtime"/>} label="Lượt khách quá giờ" sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                            <FormControlLabel control={<Checkbox checked={timeline.coming}  onChange={handleChangeTimeline} name="coming"/>} label="Lượt khách sắp đến" sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                        </FormGroup>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Sidebar;