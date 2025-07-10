import { emailInputRegex, phoneRegex } from '@/configs/formHandler.config';
import { wait } from '@/functions/promises';
import { ThreeEvent } from '@react-three/fiber';
import { NavigateFunction } from 'react-router';

/**
 * Saves each type change in the input field
 * in the formData state.
 *
 * @param e - The change event
 * @param setFormData - Function to update the form data state
 */
export function handleChange({ e, ...props }) {
    e.preventDefault();
    e.stopPropagation();
    const newValue = e.target.value;
    const name = e.target.name;
    props.setFormData((prev) => ({ ...prev, [name]: newValue }));
}

/**
 * Deactivate the input field if not focused
 *
 * @description This will trim the value and update the formData state on blur.
 *
 * @param e - The onChange event
 * @param setFocused - Function to set the focused state
 * @param setIsEditing - Function to set the editing state
 * @param setFormData - Function to update the form data state
 */
export function handleBlur({ e, ...props }) {
    e.preventDefault();
    e.stopPropagation();
    const trimedValue = e.target.value.trim();
    props.setFormData((prev) => ({
        ...prev,
        [e.target.name]: trimedValue,
    }));
    props.setIsEditing(false);
    props.setFocused(false);
}

/**
 * Handle accessibility keys.
 *
 * @param e - The change event
 */
export function handleKeyDown({ e, isMultiline = false }) {
    isMultiline = e.target.type === 'textarea' || isMultiline;
    if (
        (e.key === 'Enter' && !isMultiline) ||
        e.key === 'Tab' ||
        e.key === 'Escape'
    ) {
        e.preventDefault();
        e.currentTarget.blur();
        e.stopPropagation();
    }
}

/**
 * Activate the input field for editing
 *
 * @description This will activate the last character in the input field
 * @param e - The change event
 * @param setFocused - Function to set the focused state
 * @param setIsEditing - Function to set the editing state
 */
export function handleClick({ e, ...props }) {
    e.stopPropagation();

    if (!props.isEditing) props.setIsEditing(true);
    if (!props.focused) props.setFocused(true);

    // Auto focus the last character in the input field
    if (!props.inputRef.current) {
        const timer = setTimeout(() => {
            if (!props.inputRef.current) {
                return timer;
            }
            props.inputRef.current.focus();
            props.inputRef.current.selectionStart =
                props.inputRef.current.value.length;
        }, 5);
    } else {
        props.inputRef.current.focus();
        props.inputRef.current.selectionStart =
            props.inputRef.current.value.length;
    }
}

/**
 * Handle the form submission
 * @param e - The submit event
 * @param formData - The form data state
 */
export async function handleSubmit({
    e,
    formData,
    isSubmitting,
    retry = 3,
    ...props
}) {
    const { isFormValid, setIsSubmitting, setFormData } = props;

    e.stopPropagation();
    if (isFormValid.isValid) {
        try {
            setFormData((prev) => ({ ...prev, success: false, failed: false }));
            setIsSubmitting(true);

            await wait(3000);
            // if (!response.ok)
            // throw new Error(`Submission failed : force an error`);
            setFormData(() => ({
                name: '',
                email: '',
                message: '',
                retry: 0,
                number: '',
                success: true,
            }));
            setIsSubmitting(false);
        } catch (error) {
            if (retry > 0) {
                setFormData((prev) => ({
                    ...prev,
                    retry: retry,
                }));
                return handleSubmit({
                    e,
                    formData,
                    isSubmitting,
                    retry: retry - 1,
                    ...props,
                });
            }
            setFormData((prev) => ({
                ...prev,
                failed: true,
                success: false,
            }));
            setIsSubmitting(false);
            throw new Error(`Error during form submission: ${error}`);
        }
    }
    // Use FormData to get the values
    // const data = new FormData(formData);
    // const values = Object.fromEntries(formData);

    // console.log('Form data submitted:', values);

    // Reset the form data state
    // setFormData({
    //     name: '',
    //     email: '',
    //     message: '',
    // });
}

const notToCheck = ['number', 'retry'];
const errorArr = [];
/**
 * Check the validity of the form data
 *
 * @description This function uses the errorArr as a global just above.
 *
 * @param formData - The form data state
 */
export function checkThisFormValidity(formData) {
    errorArr.length = 0;
    let isValid = null;
    let message = 'This form is not valid';

    for (let [key, value] of Object.entries(formData)) {
        value = value.toString().trim();
        if (
            (value === '' || value === undefined) &&
            !notToCheck.includes(key)
        ) {
            errorArr.push(`Field ${key} is empty.`);
        }

        if (value !== '') {
            if (key === 'email' && !emailInputRegex.test(value)) {
                errorArr.push(`Email is not valid.`);
            }

            if (key === 'number' && !phoneRegex.test(value)) {
                errorArr.push(`Phone number ${value} is not valid.`);
            }
        }
    }

    if (errorArr.length > 0) {
        message = errorArr.join('\n');
        isValid = false;
    } else {
        isValid = true;
        message = 'Form is valid';
    }

    return { isValid: isValid, message: message };
}

/**
 * Creates a form when the envelope icon is clicked.
 *
 * @description This function navigates to the contact form page and sets the form as active.
 * - If already active or the current path is '/contact/form', it does nothing.
 *
 * @param e - Mouse click Event
 * @param navigate - Function to navigate to a different route
 * @param setFormActive - Function to set the form active state
 * @param isFormActive - Boolean indicating if the form is currently active
 */
export function createForm({
    e,
    navigate,
    setFormActive,
    isFormActive,
}: {
    e: ThreeEvent<MouseEvent>;
    navigate: NavigateFunction;
    setFormActive: (active: boolean) => void;
    isFormActive: boolean;
}) {
    e.stopPropagation();
    if (window.location.pathname !== '/contact/form') navigate('/contact/form');
    if (!isFormActive) setFormActive(true);
}
