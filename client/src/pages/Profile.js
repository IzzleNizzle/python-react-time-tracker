import React from 'react';
import { Container, Typography, Box, TextField, Button, Stack } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Timezone"
            variant="outlined"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ProfilePage;
