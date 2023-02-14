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
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';


export default function FormDialog({ open, handleClose, activityList }) {
    const activities = activityList.map(activity => {
        return { name: activity }
    })

    return (
        <div>
            <Formik
                initialValues={{ activities }}
                validationSchema={Yup.object({
                    activities: Yup.array().of(
                        Yup.object({
                            name: Yup.string().required('Activity Name Required'),
                        })
                    ),
                })}
                onSubmit={values => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                    }, 500);
                }}
            >
                {({ values, isSubmitting, handleBlur, setFieldValue, errors, touched }) => (
                    <Dialog open={open} onClose={handleClose}>
                        <Form>
                            <DialogTitle>Edit Activities</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Customize your activity options
                                </DialogContentText>
                                <FieldArray name="activities">
                                    {({ push, remove }) => (
                                        <React.Fragment>
                                            {values.activities &&
                                                values.activities.length > 0 &&
                                                values.activities.map((activity, index) => (
                                                    <FormControl
                                                        fullWidth
                                                        sx={{
                                                            my: 2,
                                                            display: 'flex',
                                                        }}
                                                        index={index}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-center' }}>
                                                            <Field name={`activities[${index}].name`}>
                                                                {({ field, }) => (
                                                                    <>
                                                                        <TextField
                                                                            id="input-with-sx"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            type="text"
                                                                            placeholder="Activity"
                                                                            value={activity}
                                                                            {...field}
                                                                            error={(touched?.activities?.[index] && errors?.activities?.[index]) && errors.activities[index].name}
                                                                            helperText={(touched?.activities?.[index] && errors?.activities?.[index]) && errors.activities[index].name}
                                                                        />
                                                                    </>
                                                                )}
                                                            </Field>
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </FormControl>
                                                ))}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-center', justifyContent: 'right' }}>
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => push({ name: '' })}
                                                >
                                                    <AddCircleIcon fontSize='large'
                                                    />
                                                </IconButton>
                                            </Box>
                                        </React.Fragment>
                                    )}
                                </FieldArray>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>Submit</Button>
                            </DialogActions>
                        </Form>
                    </Dialog>
                )}
            </Formik>
        </div>
    );
}