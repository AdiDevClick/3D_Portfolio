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
 * @param e - The change event
 * @param onChange - Function to handle the change event
 * @param setFocused - Function to set the focused state
 */
export function handleBlur({ e, ...props }) {
    e.preventDefault();
    e.stopPropagation();
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
export function handleSubmit({ e, formData, isSubmitting }) {
    if (!isSubmitting) return;
    e.stopPropagation();

    // Use FormData to get the values
    // const data = new FormData(formData);
    // const values = Object.fromEntries(formData);

    // console.log('Form data submitted:', values);
    console.log('React state:', formData, e);

    // Reset the form data state
    // setFormData({
    //     name: '',
    //     email: '',
    //     message: '',
    // });
}

export function checkThisFormValidity(formData) {
    // console.log(formData);
    let isValid = false;
    let message = 'This form is not valid';
    for (let [key, value] of Object.entries(formData)) {
        console.log('key : ', key, 'value : ', value);
        // const newValue = value.trim();
        // console.log('Ma value est trimed : ', newValue);
        if (value === '' || value === undefined) {
            console.warn(`Field ${key} is empty or undefined.`);
            return false; // Return false if any field is empty
        }
        // console.log(key, formData[key]);
        // if (formData[key] === '' || formData[key] === undefined) {
        //     return false; // Return false if any field is empty
        // }
    }
    return { isValid: true, message: 'This form is valid' };
}
