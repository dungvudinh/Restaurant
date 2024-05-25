import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.scss';
import classNames from 'classnames/bind';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import CustomAlert from '../../components/CustomAlert';
import OtpInput from 'react-otp-input';
const cx = classNames.bind(styles);

function ResetPassword() {
    const [accountInfo, setAccountInfo] = useState({
        phone_number: '', 
        password: ''
    })
    const [showAlert, setShowAlert] = useState();
    const [alertMessage, setAlertMessage] = useState({});
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const instance = axios.create({
        baseURL: 'http://localhost:4049/api', // Change this to your backend URL
        withCredentials:true, 
        
        headers: {
            "content-type": "application/json"
          },
        
      });
    const handleLogin =async ()=>{
        try 
        {
            const result = await instance.post('/authentication',accountInfo);
            setAlertMessage({status:result.data.status, message: result.data.message});
            setShowAlert(true);
            
            if(result.data.status === 'success'){
                setTimeout(()=>{
                    navigate('/reception');
                }, 1000)    
            }
        }
        catch(error){
            setAlertMessage({status:'error', message: error});
            setShowAlert(true);
        }
        
    }
    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} style={{backgroundImage:`url(http://localhost:4049/img/login-bg.jpg)`}}></div>
            <div className={cx('signup-form')}>	
            <div action="" method="post" className={cx('login-form')}>
                <h2>Đặt Lại Mật Khẩu</h2>
                <div className={cx('form-group')}>
                    <div className={cx('input-group')}>
                        <TextField id="outlined-basic" label="Mật khẩu mới" variant="standard" fullWidth={true} size='small' name='phone_number' type="password"
                        onChange={e=>setAccountInfo({...accountInfo, phone_number: e.target.value})}/>
                    </div>
                </div>
                <div className={cx('form-group')}>
                    <div className={cx('input-group')}>
                        <TextField id="outlined-basic" label="Nhập lại mật khẩu mới" variant="standard" fullWidth={true} size='small' name='password' type='password'
                        onChange={e=>setAccountInfo({...accountInfo, password: e.target.value})}/>
                    </div>
                </div>
                
                        
                <div className={cx('form-group')}>
                    <Button variant="contained" color="success" fullWidth={true} size='small' onClick={handleLogin}>
                    Đặt lại mật khẩu 
                    </Button>
                </div>
                <p style={{textAlign:'center'}}>By clicking the Sign Up button, you agree to our <br/><a href="#">Terms &amp; Conditions</a>, and <a href="#">Privacy Policy</a>.</p>
            </div>
        </div>
        {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
        </div>
     );
}

export default ResetPassword;