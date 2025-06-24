import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';

const segmentOptions = [
  'Skirts', 'Shorts', 'Dresses', 'Jeans', 'T-Shirts',
  'Pants', 'Coats', 'Jackets', 'Blazers', 'Shirt'
];

export function Sidebar({
  segment,
  setSegment,
  viewTab,
  setViewTab,
  filteredData,
  getData,
  updateSegment
}) {
  const [coverage, setCoverage] = useState({ covered: 0, total: 0 });

  // Fetch coverage stats when Charts tab is active
  useEffect(() => {
    if (viewTab === 'charts') {
      fetch('http://localhost:4000/vtsanoi/api/products/coverage')
        .then(res => res.json())
        .then(data => setCoverage(data))
        .catch(err => console.error('Coverage fetch error:', err));
    }
  }, [viewTab]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      sx={{
        boxSizing: 'border-box',
        p: 2,
        bgcolor: '#FAFAFF',
        borderRadius: 2,
        borderColor: '#42A5F5',
        borderWidth: 2,
        borderStyle: 'solid',
        height: '100%',
      }}
    >
      {/* Tabs */}
      <Tabs
        value={viewTab}
        onChange={(e, v) => setViewTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        {['segment', 'charts'].map(tab => (
          <Tab
            key={tab}
            value={tab}
            label={
              <Typography fontWeight="bold" noWrap>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Typography>
            }
            sx={{
              textTransform: 'none',
              mr: 1,
              px: 2,
              py: 1,
              border: viewTab === tab ? '2px solid #42A5F5' : '1px solid #ccc',
              borderRadius: 1,
              bgcolor: viewTab === tab ? '#E3F2FD' : 'transparent',
              minWidth: 0,
              flexShrink: 0,
              '&:hover': {
                backgroundColor: '#E3F2FD',
              }
            }}
          />
        ))}
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {/* Content */}
      {viewTab === 'segment' && (
        <Box width="100%">
          <Paper
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: segment ? '#42A5F5' : '#ccc',
              borderRadius: 2,
              width: '100%',
              '&:hover': {
                borderColor: '#42A5F5',
              }
            }}
          >
            <Select
              value={segment}
              onChange={e => setSegment(e.target.value)}
              displayEmpty
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  py: 1,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                border: 'none',
              }}
            >
              <MenuItem value="" disabled hidden>
                Select Segment
              </MenuItem>
              {segmentOptions.map(item => (
                <MenuItem key={item} value={item}>
                  <Typography fontWeight="bold" noWrap>
                    {item}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Paper>
        </Box>
      )}

      {viewTab === 'charts' && (
        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Coverage
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {coverage.total ? Math.round((coverage.covered / coverage.total) * 100) : 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={coverage.total ? (coverage.covered / coverage.total) * 100 : 0}
            sx={{ height: 12, borderRadius: 6, mb: 2 }}
          />
          <Typography variant="body2" color="textSecondary">
            {coverage.covered} of {coverage.total} items covered
          </Typography>
        </Box>
      )}
    </Box>
  );
}
