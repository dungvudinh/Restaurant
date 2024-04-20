import classNames from "classnames/bind";
import styles from './Sidebar.module.scss';
import { Input, FormControlLabel, RadioGroup, Radio, FormGroup, Checkbox, Autocomplete, TextField} from '@mui/material';
import { Search } from "@mui/icons-material";


const cx  = classNames.bind(styles);
const top100Films = [
{ label: 'Bàn số 1', year: 1994 },
  { label: 'Bàn số 2', year: 1972 },
  { label: 'Bàn số 3', year: 1974 },
  { label: 'Bàn số 4', year: 2008 },

]

function Sidebar() {
    return ( 
        <div className={cx('wrapper')}>
            <h2 className={cx('sidebar-header')}>Đặt bàn</h2>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Tìm kiếm</h5>
                    <div className={cx('input-wrapper')}>
                        <Search fontSize="small" className={cx('search-icon')}/>
                        <Input autoFocus={true} placeholder="Theo mã đặt bàn" fullWidth={true}/>
                    </div>
                </div>
            </div>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Thời gian đặt</h5>
                    <div className={cx('input-wrapper')}>
                        <RadioGroup defaultValue="all" name="radio-button-group" sx={{fontSize:12}}>
                            <FormControlLabel value="all" control={<Radio size="medium"/>} label="Toàn thời gian" sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
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
                         <Autocomplete multiple options={top100Films} fullWidth={true} getOptionLabel={(option)=>option.label}
                         renderInput={(params)=><TextField {...params} label="Chọn phòng/bàn" sx={{'.MuiFormLabel-root':{fontSize:'15px'}}} variant="standard"/>}
                         size="small" sx={{'& ~ .MuiAutocomplete-popper': {fontSize:'15px'}}}/>
                    </div>
                </div>
            </div>

            <div className={cx('sidebar-item')}>
                <div className={cx('sidebar-item_search')}>
                    <h5 className={cx('item-search_title')}>Lựa chọn hiển thị</h5>
                    <div className={cx('input-wrapper')}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked/>} label="Lượt khách quá giờ" sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                            <FormControlLabel control={<Checkbox  />} label="Lượt khách sắp đến" sx={{'& .MuiFormControlLabel-label': {fontSize:15}}}/>
                        </FormGroup>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Sidebar;