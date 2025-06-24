import React, { useState, useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Tabs,
  Tab,
  Typography,
  FormControl,
  Checkbox,
  ListItemText,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Drawer,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaExpand, FaDownload, FaChevronLeft, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { Sidebar } from './Sidebar';
import { useTheme } from '@mui/material/styles';

// Filter & segment options
const columnOptions = ['Product Name', 'Brand', 'Color', 'Material'];
const operatorOptions = ['Equals', 'Contains', 'Starts With', 'Ends With'];
const groundTruthOptions = [
  'Skirts', 'Shorts', 'Dresses', 'Jeans', 'T-Shirts',
  'Pants', 'Coats', 'Jackets', 'Blazers', 'Shirt'
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [mainTab, setMainTab] = useState(0);
  const [viewTab, setViewTab] = useState('segment');
  const [segment, setSegment] = useState('');
  const [page, setPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const rowsPerPage = 10;

  // Helpers
  const toParamKey = col =>
    col.toLowerCase()
      .replace(/[_\s]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^./, s => s.toLowerCase());
  const buildQueryParams = conds => {
    const params = new URLSearchParams();
    conds.forEach(cond => {
      const key = toParamKey(cond.column);
      const val = Array.isArray(cond.value) ? cond.value.join(',') : cond.value;
      params.append(key, val);
      params.append('operator', cond.operator);
      params.append('values', cond.value);
    });
    return params.toString();
  };

  // Fetch data
  const getData = () => {
    const qs = conditions.length ? `?${buildQueryParams(conditions)}` : '';
    fetch(`http://localhost:4000/vtsanoi/api/products/getProducts${qs}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {
        const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        setFilteredData(data);
      })
      .catch(() => setFilteredData([]));
    setPage(1);
  };

  // Commit segment update
  const updateSegment = () => {
    if (!filteredData.length || !segment) return;
    const ids = filteredData.map(r => r.UI_ID).join(',');
    fetch(
      `/vtsanoi/api/products/bulk-update-segment?ids=${ids}&segment=${segment}`,
      { method: 'PUT' }
    )
      .then(res => res.ok && getData())
      .catch(console.error);
  };

  // Handlers
  const addCondition = () =>
    setConditions(c => [...c, { column: 'Product Name', operator: 'Equals', value: [] }]);
  const deleteCondition = idx =>
    setConditions(c => c.filter((_, i) => i !== idx));
  const handleConditionChange = (idx, key, val) =>
    setConditions(c =>
      c.map((cond, i) => (i === idx ? { ...cond, [key]: val } : cond))
    );

  // Download CSV
  const downloadCsv = () => {
    if (!filteredData.length) return;
    const headers = Object.keys(filteredData[0]);
    const csv = [
      headers.join(','),
      ...filteredData.map(r =>
        headers.map(h => JSON.stringify(r[h])).join(',')
      )
    ].join('\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'products.csv');
  };

  // Pagination
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const displayedRows = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => getData(), []);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="100vh"
      bgcolor="#F4F8FF"
      sx={{
        overflow: 'hidden',
        padding: 3,
        width: '90vw', // Updated: 90% of the viewport width
        margin: '0 auto' // Centered horizontally
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#42A5F5',
            '&:hover': {
              backgroundColor: '#1E88E5',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main Content */}
      <Box
        flexGrow={1}
        px={{ xs: 2, sm: 5 }}
        py={{ xs: 2, sm: 4 }}
        minWidth={0}
        overflowY="auto"
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
          width: '100%' // Make the main content fill the available space
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          VT-SANIO
        </Typography>
        <Breadcrumbs separator="›" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="#">
            Project
          </Link>
          <Typography fontWeight="bold">Fashion_Ecommerce</Typography>
        </Breadcrumbs>

        <Tabs
          value={mainTab}
          onChange={(e, v) => setMainTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4, borderBottom: '2px solid #42A5F5' }}
        >
          {['Patterns', 'Prompts', 'Embeddings'].map(l => (
            <Tab
              key={l}
              label={<Typography fontWeight="bold">{l}</Typography>}
              sx={{
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#E3F2FD',
                },
              }}
            />
          ))}
        </Tabs>

        <Card elevation={5} sx={{ mb: 4, borderRadius: 3, padding: 3 }}>
          <CardContent>
            <Button
              variant="contained"
              size="large"
              onClick={addCondition}
              sx={{
                mb: 3,
                fontWeight: 'bold',
                backgroundColor: '#42A5F5',
                '&:hover': {
                  backgroundColor: '#1E88E5',
                }
              }}
            >
              + Add Condition
            </Button>
            <Divider sx={{ mb: 3 }} />

            {conditions.map((cond, i) => (
              <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={cond.column}
                      label="Column"
                      onChange={e => handleConditionChange(i, 'column', e.target.value)}
                    >
                      {columnOptions.map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={cond.operator}
                      label="Operator"
                      onChange={e => handleConditionChange(i, 'operator', e.target.value)}
                    >
                      {operatorOptions.map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Label</InputLabel>
                    <Select
                      multiple
                      value={cond.value}
                      label="Label"
                      renderValue={sel => sel.join(', ')}
                      onChange={e => handleConditionChange(i, 'value', e.target.value)}
                    >
                      {groundTruthOptions.map(item => (
                        <MenuItem key={item} value={item}>
                          <Checkbox checked={cond.value.includes(item)} />
                          <ListItemText primary={item} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={1} textAlign="center">
                  <IconButton color="error" onClick={() => deleteCondition(i)}>
                    <FaTrashAlt />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            {conditions.length > 0 && (
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={getData}
                  sx={{ mr: 2 }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={updateSegment}
                  disabled={!segment}
                >
                  Commit
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Select size="small" displayEmpty sx={{ fontWeight: 'bold' }} value="Table View">
            <MenuItem value="Table View">Table View</MenuItem>
          </Select>
          <Box>
            <IconButton onClick={() => setIsExpanded(!isExpanded)}><FaExpand /></IconButton>
            <IconButton onClick={downloadCsv}><FaDownload /></IconButton>
            <IconButton disabled={page === 1} onClick={() => setPage(p => p - 1)}><FaChevronLeft /></IconButton>
            <IconButton disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}><FaChevronRight /></IconButton>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={2} sx={{ mb: 4, borderRadius: 3, bgcolor: '#FFF', width: '100%', maxHeight: isExpanded ? 'none' : 400, overflowY: 'auto' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
              <TableRow>
                {filteredData[0] && Object.keys(filteredData[0]).map(col => (
                  <TableCell key={col} sx={{ fontWeight: 'bold', borderBottom: '2px solid #90CAF9' }}>
                    {col.replace('_', ' ')}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Object.keys(filteredData[0] || {}).length} align="center">
                    <Typography fontWeight="bold">No data available</Typography>
                  </TableCell>
                </TableRow>
              ) : displayedRows.map((row, i) => (
                <TableRow key={i} hover sx={{ bgcolor: i % 2 ? '#FAFAFA' : '#FFFFFF' }}>
                  {Object.entries(row).map(([k, v], j) => (
                    <TableCell key={j} sx={{ fontWeight: 'bold', py: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', sm: 'block' }, flexShrink: 0, width: '30%', p: 2 }}>
        <Paper variant="outlined" sx={{ borderColor: '#42A5F5', borderWidth: 2, borderStyle: 'solid', borderRadius: 3, bgcolor: '#FAFAFF', height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
          <Sidebar segment={segment} setSegment={setSegment} viewTab={viewTab} setViewTab={setViewTab} filteredData={filteredData} getData={getData} updateSegment={updateSegment} />
        </Paper>
      </Box>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 300, p: 2 }}>
            <Sidebar segment={segment} setSegment={setSegment} viewTab={viewTab} setViewTab={setViewTab} filteredData={filteredData} getData={getData} updateSegment={updateSegment} />
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
