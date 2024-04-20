import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Input } from '@mui/material';
import { AssignmentTurnedIn, Create, NotInterested } from '@mui/icons-material';

export default function CanCelBookingDialog({isOpenDialog,onCloseDialog }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
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
          <DialogContentText id="alert-dialog-description" sx={{fontSize:'15px', marginBottom:'10px'}}>
            Bạn có chắc chắn muốn hủy phiếu đặt bàn DB001 này không ? 
          </DialogContentText>
          <Input size='small' fullWidth={true} placeholder='Lý do hủy' 
          startAdornment={<IconButton size='small'><Create fontSize='small'/></IconButton>}
          sx={{fontSize:'15px'}}/>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onCloseDialog}  sx={{backgroundColor:'#ef3c4d', color:"#fff", fontSize:'15px'}}>
            
            Đồng ý
          </Button> */}
          <Button size='small'  sx={{backgroundColor:'#ef3c4d', color:"#fff", fontSize:'12px'}} variant='filled' onClick={onCloseDialog}>
            <AssignmentTurnedIn fontSize='small' sx={{marginRight:'5px'}}/>
            Đồng ý
            </Button>
          <Button onClick={onCloseDialog} autoFocus size='small' sx={{backgroundColor:'#85888c', color:"#fff", fontSize:'12px'}} variant='filled'> 
            <NotInterested fontSize='small' sx={{marginRight:'5px'}}/>
            Bỏ qua
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}