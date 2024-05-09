import { Alert, Snackbar} from "@mui/material";
import { useEffect } from "react";

function CustomAlert({ alert, open, onClose }) {
    console.log(alert)
    useEffect(() => {
        if(open)
        {
            const timer = setTimeout(()=>{
                onClose();
            }, 2000)
            return ()=>clearTimeout(timer);
        }
    }, [open, onClose]);
  
    return (
      <Snackbar open={open} autoHideDuration={null} onClose={onClose}  anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
        <Alert elevation={6}  severity={alert.status}>
          {alert.message}
        </Alert>
      </Snackbar>
    );
  }
export default CustomAlert;