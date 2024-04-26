import { forwardRef } from "react";
import { Stack, TableCell, TableRow, TableBody ,TableHead, Table, TableContainer } from "@mui/material";


function createData(id, name, quantity, price) {
    return { id, name, quantity, price };
  }
  
  const rows = [
    createData(1, 'Bún bò huế', 1, 45000),
    createData(2, 'Bún bò huế', 1, 45000),
  ];
const PaymentPDF = forwardRef((props, ref)=>{
    return ( 
        <div className="wrapper" ref={ref} style={{padding:'30px'}}>
            <Stack direction="row" marginBottom="10px">
              <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tên cửa hàng:</p>
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
              <p style={{fontSize:'15px', fontWeight:'600', marginRight:'5px'}}>HD00002</p>
            </Stack>

            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Khách hàng:</p>
              <h4 style={{fontSize:'14px'}}>Vũ Đình Dũng</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Địa chỉ:</p>
              <h4 style={{fontSize:'14px'}}>Đại học Công Nghiệp Hà Nội - Nhổn</h4>
            </Stack>
            <Stack direction="row" marginBottom="20px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Điện thoại:</p>
              <h4 style={{fontSize:'14px'}}>0869370492</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" >
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Người bán:</p>
              <h4 style={{fontSize:'14px'}}>Hoàng Việt Anh</h4>
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
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">
                      <h4>{row.name}</h4>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tổng tiền hóa đơn:</p>
              <h4 style={{fontSize:'14px'}}>90,000</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Chiết khấu:</p>
              <h4 style={{fontSize:'14px'}}>0</h4>
            </Stack>
            <Stack direction="row" marginBottom="10px" justifyContent="flex-end" marginRight="10px">
            <p style={{fontSize:'14px', fontWeight:'600', marginRight:'5px'}}>Tổng cộng:</p>
              <h4 style={{fontSize:'14px'}}>90,000</h4>
            </Stack>
        </div>
    )
})



export default PaymentPDF;