import {
  Button,
  CircularProgress,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  debounce,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { getCustomers } from '../api/CustomersManager';

export default function CustomerListPage() {
  // State
  const [searchText, setSearchText] = useState<string>('');

  // Api
  const customersQuery = useQuery({
    queryKey: ['customers', searchText],
    queryFn: options => getCustomers(searchText, options),
  });

  // Callbacks
  const handleExportExcel = useCallback(() => {
    if (!customersQuery.data) return;

    const data = customersQuery.data.map(row => ({
      Name: row.name,
      Address: row.address,
      Email: row.email,
      Phone: row.phone,
      IBAN: row.iban,
      Category: row.category?.description ?? '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  }, [customersQuery.data]);

  // Render
  return (
    <>
      <Typography variant='h4' sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        Customers
      </Typography>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          onChange={e => debounce(() => setSearchText(e.target.value), 500)()}
          placeholder='Search customers...'
          fullWidth
        />
        <Button variant='outlined' onClick={handleExportExcel}>
          Export
        </Button>
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
            {customersQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : customersQuery.isError ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  Error loading customers.
                </TableCell>
              </TableRow>
            ) : !customersQuery.data?.length ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customersQuery.data?.map(row => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.iban}</TableCell>
                  <TableCell>{row.category?.description ?? ''}</TableCell>
                </TableRow>
              ))
            )}
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
