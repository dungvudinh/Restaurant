import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import CustomAlert from '../../components/CustomAlert';
import OtpInput from 'react-otp-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import {RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
import auth from '../../config/firebase.config';
// import firebase from '../../config/firebase.config';
const cx = classNames.bind(styles);

function Login() {
    const [accountInfo, setAccountInfo] = useState({
        phone_number: '', 
        password: ''
    })
    const [showAlert, setShowAlert] = useState();
    const [alertMessage, setAlertMessage] = useState({});
    const [openInputOTP, setOpenInputOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [isLoading, setIsLoading] =useState(false);
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
  
   useEffect(()=>{
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        defaultCountry:'VN'
        })
   },[])
    
    const onCaptchaVerify = ()=>{
        ;
    }
    const handleSendOTP = async ()=>{
        if(!accountInfo.phone_number){
            setAlertMessage({status:'error', message: 'Vui lòng nhập số điện thoại'});
            setShowAlert(true);
        }
        else{
            setOpenInputOTP(true);
            setIsLoading(true);
            const appVerifier = window.recaptchaVerifier;
            const phoneNumber ='+84'+accountInfo.phone_number.substring(1);
            await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setAlertMessage({status:'success', message: 'Gửi OTP thành công'});
                setShowAlert(true);
                setIsLoading(false)
            // ...
            }).catch((error) => {
                setAlertMessage({status:'error', message:'Bạn đã gửi OTP quá nhiều lần.Vui lòng thử lại trong vài phút nữa'});
                setShowAlert(true);
                setIsLoading(false)
            
            });
        }
    }
    
    const handleVerifyOTP = ()=>{
       setIsLoading(true);
       console.log(otp);
       console.log( window.confirmationResult)
       if(window.confirmationResult){
           window.confirmationResult.confirm(otp)
           .then(async(res)=>{
                setAlertMessage({status:'success', message:'Xác thực OTP thành công'});
                setShowAlert(true);
                setIsLoading(false)
           })
           .catch((error)=>{
                setAlertMessage({status:'error', message:'Xác thực OTP thất bại'});
                setShowAlert(true);
                setIsLoading(false)
           })
       }
       else{
            setAlertMessage({status:'error', message:'Bạn đang sử dụng mã OTP cũ.Vui lòng thử lại'});
            setShowAlert(true);
            setIsLoading(false)
       }
    }
    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} style={{backgroundImage:`url(http://localhost:4049/img/login-bg.jpg)`}}></div>
            <div className={cx('signup-form')}>	
            <div action="" method="post" className={cx('login-form')}>
                <h2>Đăng Nhập</h2>
                <div className={cx('form-group')}>
                    <div className={cx('input-group')}>
                        <TextField id="outlined-basic" label="Số điện thoại" variant="standard" fullWidth={true} size='small' name='phone_number' type="number"
                        onChange={e=>setAccountInfo({...accountInfo, phone_number: e.target.value})} required/>
                    </div>
                </div>
                <div id="recaptcha-container"></div>

                {!openInputOTP && (
                    <div className={cx('form-group')}>
                        <div className={cx('input-group')}>
                            <TextField id="outlined-basic" label="Mật khẩu" variant="standard" fullWidth={true} size='small' name='password' type='password'
                            onChange={e=>setAccountInfo({...accountInfo, password: e.target.value})} required/>
                        </div>
                    </div>
                )}
                {openInputOTP && (

                    <div className={cx('form-group')}>
                        <span style={{fontWeight:'600', color:'#666'}}>Nhập mã OTP</span>
                        <OtpInput
                            value={otp}
                            onChange={setOTP}
                            numInputs={6}
                            // renderSeparator={<span>-</span>}
                            containerStyle={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}
                            inputStyle={{border:'none', borderBottom:'1px solid #666', width:'40px', height:'35px'}}
                            renderInput={(props) => <input {...props}  inputType="number" shouldAutoFocus={true}/>}
                        />
                        <p style={{color:'#666', marginTop:'10px'}}>Mã OTP đã được gửi về số điện thoại {accountInfo.phone_number}</p>
                    </div>   
                )}
                <div className={cx('form-group')}>
                    {!openInputOTP ?(
                        <Button variant="contained" color="success" fullWidth={true} size='small' onClick={handleLogin}>
                        Đăng nhập
                        </Button>
                    )
                    :
                    (
                        <Button variant="contained" color="success" fullWidth={true} size='small' onClick={handleVerifyOTP}>
                            {isLoading && (<FontAwesomeIcon icon={faCircleNotch} style={{marginRight:'10px'}} className={cx('loading')}/>)}
                            Xác thực OTP
                        </Button>
                    )
                    }
                </div>
                <p style={{textAlign:'center'}}>By clicking the Sign Up button, you agree to our <br/><a href="#">Terms &amp; Conditions</a>, and <a href="#">Privacy Policy</a>.</p>
                <div style={{textAlign:'center', marginTop:'10px'}}>Quên mật khẩu? <Link onClick={handleSendOTP}>gửi OTP thông qua SMS</Link>.</div>
            </div>
        </div>
        {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
        </div>
     );
}

export default Login;