import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Activities</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Customize your activity options
                    </DialogContentText>
                    <FormControl fullWidth sx={{
                        my: 2,
                        display: 'flex',
                    }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-center' }}>
                            <TextField id="input-with-sx" variant="outlined" size="small" />
                            <IconButton
                                aria-label="toggle password visibility"
                            // onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            >
                                <DeleteIcon
                                />
                            </IconButton>
                        </Box>
                    </FormControl>
                    <FormControl fullWidth sx={{
                        my: 2,
                        display: 'flex',
                    }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-center' }}>
                            <TextField id="input-with-sx" variant="outlined" size="small" />
                            <IconButton
                                aria-label="toggle password visibility"
                            // onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            >
                                <DeleteIcon
                                />
                            </IconButton>
                        </Box>
                    </FormControl>
                    <Box sx={{ display: 'flex', alignItems: 'flex-center', justifyContent: 'right' }}>
                        <IconButton
                            aria-label="toggle password visibility"
                        // onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                        >
                            <AddCircleIcon fontSize='large'
                            />
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}