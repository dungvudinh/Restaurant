import { useState, useMemo,Fragment } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
Checkbox,Box, TablePagination, TableSortLabel,
IconButton,
Tooltip} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Circle, DriveFileRenameOutline, NoteAlt, Done, Delete, DeleteOutline, EditLocation } from '@mui/icons-material';
import Dialog from '../Dialog';
import CancelBookingDialog from '../CancelBookingDialog';
function createData(  id, timein, client, phone, quantity, room, status, note) {
  return { id, timein, client, phone, quantity, room, status, note };
}

const rows = [
  createData('DB001','20/04/2024 8:30', 'Vũ Đình Dũng', '0355969145', 4, 6,1, 'Khách đến muộn 30p'),
  createData('DB002', 'Ice cream sandwich', 237, 9.0, 37, 4.3, 2, ''),
  createData('DB003', 'Eclair', 262, 16.0, 24, 6.0, 3, ''),
  createData('DB004','Cupcake', 305, 3.7, 67, 4.3, 4, ''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),
  createData('DB005','Gingerbread', 356, 16.0, 49, 3.9, 1,''),

];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor:'#e5effa',
    borderTop: '1px solid #b7d4f1', 
    borderBottom: '1px solid #b7d4f1'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const styledStatus = (id)=>
  {
    var styledStatus = {};
    if(id ===1) 
    {
      styledStatus.title = "Chờ xếp bàn";
      styledStatus.statusColor = "#FF9900";
    }
    else if(id ===2)
    {
      styledStatus.title = "Đã xếp bàn";
      styledStatus.statusColor = "#28B44F";
    }
    else if(id ===3)
    {
      styledStatus.title = "Đã nhận bàn";
      styledStatus.statusColor = "#0066CC";
    }
    else if(id ===4)
      {
        styledStatus.title = "Đã hủy";
        styledStatus.statusColor = "#EF3C4D";
      }
    return styledStatus;
  }
const headCells = [
  {
    id:1, 
    title: 'Thao tác', 
    minWidth:170
  }, 
  {
    id:2, 
    title: 'Mã đặt bàn', 
    minWidth:120
  }, 
  {
    id:3, 
    title: 'Giờ đến', 
    minWidth:170
  }, 
  {
    id:4, 
    title: 'Khách hàng', 
    minWidth:150
  }, 
  {
    id:5, 
    title: 'Điện thoại', 
    minWidth:120
  }, 
  {
    id:6, 
    title: 'Số khách', 
    minWidth:100
  }, 
  {
    id:7, 
    title: 'Phòng/Bàn', 
    minWidth:100
  }, 
  {
    id:8, 
    title: 'Trạng thái', 
    minWidth:150
  }, 
  {
    id:9, 
    title: 'Ghi chú', 
    minWidth:250
  }, 
]

var actions = [
  {
    id:1, 
    title: 'Nhận bàn', 
    size:'small', 
    color: '#0066CC', 
    icon: <Done fontSize='small'/>, 
    useForStatusIds: [2]
  }, 
  {
    id:2, 
    title: 'Nhận gọi món', 
    size:'small', 
    color: '#0066CC', 
    icon: <NoteAlt fontSize='small'/>, 
    useForStatusIds: [2, 3]
  }, 
  {
    id:3, 
    title: 'Cập nhập', 
    size:'small', 
    color: '#0066CC', 
    icon: <DriveFileRenameOutline fontSize='small'/>, 
    useForStatusIds: [1]
  }, 
  {
    id:4, 
    title: 'Hủy đặt', 
    size:'small', 
    color: '#EF3C4D', 
    icon: <DeleteOutline fontSize='small'/>, 
    useForStatusIds: [1,2, 3, 4]
  }
]

export default function DenseTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isOpenCancelBookingDialog, setOpenCancelBookingDialog]  = useState(false);
  const [currentUpdateData, setCurrentUpdateData] = useState({});
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    const emptyRows =page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const visibleRows =useMemo(
      () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage],
    )
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };
    const handleOpenDialog =(id)=>{
      setOpenDialog(true);
      setCurrentUpdateData();
    }
    
    const handleCloseDialog = () =>setOpenDialog(false);
  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <Paper  sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="medium" aria-label="a dense table"  >
              <EnhancedTableHead numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}/>
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                  <TableRow
                    key={index} hover 
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, height:'53' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} 
                      onClick={(event) => handleClick(event, row.id)}
                      inputProps={{
                        'aria-label': 'select all desserts',
                      }}/>
                    </TableCell>
                    <TableCell align="left">
                      {actions.reduce((arr, action)=>{
                        if(action.useForStatusIds.includes(row.status))
                          return [...arr, action];
                        else 
                          return arr;
                      }, [])
                      .map((action)=>( 
                        <Tooltip title={action.title} key={action.id}>
                            <IconButton size={action.fontSize} sx={{color:action.color}} 
                            onClick={()=>{
                              if(action.id ===3)
                                handleOpenDialog(action.id)
                              else if(action.id === 4)
                                setOpenCancelBookingDialog(true);
                            }}>
                              {action.icon}
                            </IconButton>
                      </Tooltip>
                      ))}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{color:'#0066CC'}}>{row.id}</TableCell>
                    <TableCell align="left">{row.timein}</TableCell>
                    <TableCell align="left">{row.client}</TableCell>
                    <TableCell align="left">{row.phone}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.room}</TableCell>
                    <TableCell align="left">
                      <Circle fontSize='small' sx={{width:'10px', height:'10px', marginRight:'5px', color:styledStatus(row.status).statusColor}} />
                      {styledStatus(row.status).title}
                    </TableCell>
                    <TableCell align="left">{row.note}</TableCell>
                  </TableRow>)
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}/>
        </Paper>

      </Box>
      <Dialog onCloseDialog={handleCloseDialog} isOpenDialog={isOpenDialog} />
      <CancelBookingDialog isOpenDialog={isOpenCancelBookingDialog} onCloseDialog={()=>setOpenCancelBookingDialog(false)}/>
    </Fragment>
  );
}
function EnhancedTableHead(props) {
  const { onSelectAllClick,  numSelected, rowCount, onRequestSort } =props;
  return (
    <TableHead>
      <StyledTableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map(cell=>(
          <TableCell key={cell.id} align="left" style={{ minWidth: cell.minWidth}}>{cell.title}</TableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}