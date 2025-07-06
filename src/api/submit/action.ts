// export async function submitAction<T>(
//     url: string,
//     data: T,
//     options?: RequestInit
// ): Promise<Response> {
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             ...options?.headers,
//         },
//         body: JSON.stringify(data),
//         ...options,
//     });

import {
    emailErrorMessage,
    emailInputRegex,
    emptyInputsErrorMessage,
    successMessage,
} from '@/configs/formHandler.config';

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response;
// }

export async function formActionHandler<T>(prevState: any, formData: FormData) {
    let success = true;
    let message = successMessage;

    const email = formData.get('email') as string;
    const body = formData.get('message') as string;

    for (let [key, value] of formData) {
        value = key.type !== 'File' ? value.trim() : value;

        if (value.length === 0) {
            message = emptyInputsErrorMessage;
        }

        if (key === 'email' && !emailInputRegex.test(email)) {
            message = emailErrorMessage;
        }
    }

    // if (email.length === 0 || body.length === 0) {
    //     throw new Error(emptyInputsErrorMessage);
    // }

    // if (!emailInputRegex.test(email)) {
    //     return {
    //         success: false,
    //         message: emailErrorMessage,
    //     };
    // }
    // if (!email.includes('@')) {
    // return {
    //         success: false,
    //         message: 'L\'email doit contenir un "@"',
    //     };
    // }

    return {
        success: success,
        message: successMessage,
    };
}
