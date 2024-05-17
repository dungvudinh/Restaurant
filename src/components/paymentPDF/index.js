import { forwardRef, useState, useEffect} from "react";
import { Stack, TableCell, TableRow, TableBody ,TableHead, Table, TableContainer } from "@mui/material";
import axios from "axios";



  

const PaymentPDF = forwardRef(({data, onCloseDialog}, ref)=>{
  const [client, setClient] = useState({});
  useEffect(()=>{
    axios.get(`http://localhost:4049/api/client?id=${data.client_id}`)
    .then(res=>setClient(res.data[0]))
  }, [])
    return ( 
        <div className="wrapper" ref={ref} style={{padding:'30px'}}>
            <Stack direction="row" marginBottom="10px">
              <h4 style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tên cửa hàng:</h4>
              <h4 style={{fontSize:'14px'}}>Ha Noi Cuisine Corner</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px">
              <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Chi nhánh:</p>
              <h4 style={{fontSize:'14px'}}>Cầu Giấy - Hà Nội</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px">
              <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Điện thoại:</p>
              <h4 style={{fontSize:'14px'}}>19008198</h4>
            </Stack>

            <Stack direction="row" marginBottom="10px">
              <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Ngày bán:</p>
              <h4 style={{fontSize:'14px'}}>{`${new Date().getDate()}/${new Date().getMonth() +1}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`}</h4>
            </Stack>
            <Stack direction="column" marginBottom="10px" justifyContent="center" alignItems="center">
              <h4 style={{fontSize:'16px', fontWeight:'600', marginRight:'5px'}}>HÓA ĐƠN BÁN HÀNG</h4>
              <p style={{fontSize:'15px', fontWeight:'600', marginRight:'5px'}}>{data.order_code}</p>
            </Stack>

            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Khách hàng:</p>
              <h4 style={{fontSize:'14px'}}>{client.full_name}</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Địa chỉ:</p>
              <h4 style={{fontSize:'14px'}}>{client.address}</h4>
            </Stack>
            <Stack direction="row" marginBottom="20px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Điện thoại:</p>
              <h4 style={{fontSize:'14px'}}>{client.phone_number}</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Người bán:</p>
              <h4 style={{fontSize:'14px'}}>{data.employee}</h4>
            </Stack>
          <TableContainer >
          <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tên món</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="left">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.order_menu.map((orderMenuItem , index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">
                      <h4>{orderMenuItem.order_menu_name}</h4>
                    </TableCell>
                    <TableCell align="left">{orderMenuItem.order_menu_quantity}</TableCell>
                    <TableCell align="left">{orderMenuItem.order_menu_price}</TableCell>  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tổng tiền hóa đơn:</p>
              <h4 style={{fontSize:'14px'}}>{data.total}</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Chiết khấu:</p>
              <h4 style={{fontSize:'14px'}}>0</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tổng cộng:</p>
              <h4 style={{fontSize:'14px'}}>{data.total}</h4>
            </Stack>
        </div>
    )
})



export default PaymentPDF;