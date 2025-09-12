import {
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomerListQuery } from '../types/entities';
import { getCustomers } from '../api/CustomersManager';
import { debounce } from '../utils/utils';

export default function CustomerListPage() {
  // State
  const [list, setList] = useState<CustomerListQuery[]>([]);
  const [searchText, setSearchText] = useState<string>();

  // Effects
  useEffect(() => {
    const controller = new AbortController();
    debounce(
      () =>
        getCustomers(searchText, { signal: controller.signal })
          .then(data => setList(data))
          .catch(err => {
            if (err.name === 'AbortError') return;
            console.error('Error fetching customers', err);
          }),
      300,
    )();
    return () => {
      controller.abort();
    };
  }, [searchText]);

  // Render
  return (
    <>
      <Typography variant='h4' sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        Customers
      </Typography>

      <div style={{ marginBottom: '16px' }}>
        <Input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder='Search customers...'
          fullWidth
        />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>IBAN</StyledTableHeadCell>
              <StyledTableHeadCell>Category</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(row => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.iban}</TableCell>
                <TableCell>{row.category?.description ?? ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));
