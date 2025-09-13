import {
  CircularProgress,
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
import { getSuppliers } from '../api/SuppliersManager';
import { useQuery } from '@tanstack/react-query';

export default function SupplierListPage() {
  // Api
  const suppliersQuery = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getSuppliers(),
  });

  // Render
  return (
    <>
      <Typography variant='h4' sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        Suppliers
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliersQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : suppliersQuery.isError ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  Error loading customers.
                </TableCell>
              </TableRow>
            ) : !suppliersQuery.data?.length ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              suppliersQuery.data?.map(row => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
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
