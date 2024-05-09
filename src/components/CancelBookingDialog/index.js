import{useState, Fragment}from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Input, Backdrop, CircularProgress } from '@mui/material';
import { AssignmentTurnedIn, Create, NotInterested } from '@mui/icons-material';
import {useStore, actions} from '../../store';
import CustomAlert from '../CustomAlert';
export default function CancelBookingDialog({isOpenDialog,onCloseDialog, data }) {
  const [state, dispatch] = useStore();
  const [isLoading, setLoading]= useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});
  
  const handleSubmit = async ()=>
    {
      try 
        {
            const result = await axios.put(`http://localhost:4049/api/booking/cancel`, {data:{booking_code:data.booking_code}});
            const newListBooking = await axios.get('http://localhost:4049/api/booking');
            if(result.data.status === 'success')
                dispatch(actions.setListBooking(newListBooking.data));
            setAlertMessage({status:result.data.status, message: result.data.message});
            setShowAlert(true);
        }
        catch(error)
        {
            setAlertMessage({status:'error', message: error.message});
            setShowAlert(true);
        }
        finally
        {
            setTimeout(()=>
            {
                setLoading(false)
                onCloseDialog();
            }, 1000)
        }
    }
  return (
    <Fragment>
      <Dialog
        open={isOpenDialog}
        onClose={onCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontSize="20px">
          Hủy đặt chỗ 
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{fontSize:'14px', marginBottom:'10px'}}>
            Bạn có chắc chắn muốn hủy phiếu đặt bàn {data.booking_code} này không ? 
          </DialogContentText>
          <Input size='small' fullWidth={true} placeholder='Lý do hủy' 
          startAdornment={<IconButton size='small'><Create fontSize='small'/></IconButton>}
          sx={{fontSize:'14px'}}/>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onCloseDialog}  sx={{backgroundColor:'#ef3c4d', color:"#fff", fontSize:'15px'}}>
            
            Đồng ý
          </Button> */}
          <Button size='small'  sx={{backgroundColor:'#ef3c4d', color:"#fff", fontSize:'12px'}} variant='filled' onClick={handleSubmit}>
            <AssignmentTurnedIn fontSize='small' sx={{marginRight:'5px'}}/>
            Đồng ý
            </Button>
          <Button onClick={onCloseDialog} autoFocus size='small' sx={{backgroundColor:'#85888c', color:"#fff", fontSize:'12px'}} variant='filled'> 
            <NotInterested fontSize='small' sx={{marginRight:'5px'}}/>
            Bỏ qua
          </Button>
        </DialogActions>
      </Dialog>
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
      open={isLoading}
      >
          <CircularProgress color="inherit" />
      </Backdrop>
      {showAlert && <CustomAlert alert={alertMessage} open={showAlert} onClose={()=>setShowAlert(false)}/>}
    </Fragment>
  );
}