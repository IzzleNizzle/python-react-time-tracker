import React from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import { Debug } from '../components/Debug';
import * as Yup from 'yup';

const initialValues = {
    activities: [
        {
            name: '',
        },
    ],
};

const Invitation = () => (
    <div>
        <h1>Invite friends</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                activities: Yup.array().of(
                    Yup.object({
                        name: Yup.string().required('Required'),
                    })
                ),
            })}
            onSubmit={values => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                }, 500);
            }}
        >
            {({ values, isSubmitting, handleBlur, setFieldValue }) => (
                <Form>
                    <FieldArray name="activities">
                        {({ push, remove }) => (
                            <React.Fragment>
                                {values.activities &&
                                    values.activities.length > 0 &&
                                    values.activities.map((friend, index) => (
                                        <div className="row">
                                            <div className="col">
                                                <Field name={`activities[${index}].name`}>
                                                    {({ field, form }) => (
                                                        <input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Jane Doe"
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name={`activities[${index}].name`}>
                                                    {msg => <div className="field-error">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                            <div className="col">
                                                <button type="button" onClick={() => remove(index)}>
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                <button
                                    type="button"
                                    onClick={() => push({ name: '', email: '' })}
                                    className="secondary"
                                >
                                    Add Friend
                                </button>
                            </React.Fragment>
                        )}
                    </FieldArray>
                    <button type="submit" disabled={isSubmitting}>
                        Invite
                    </button>
                    <Debug />
                </Form>
            )}
        </Formik>
    </div>
);

export default Invitation;

// editorState: new EditorState.createEmpty(),

// Yup.object({
//   friends: Yup.array().of(
//     Yup.object({
//       name: Yup.string().required('Required'),
//       email: Yup.string()
//         .email('Invalid email')
//         .required('Required'),
//     })
//   ),
// })