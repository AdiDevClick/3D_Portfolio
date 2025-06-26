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

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response;
// }

export async function action<T>(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!email || !message) {
        throw new Error('Un Email et un message sont requis.');
    }

    if (!email.includes('@')) {
        return {
            success: false,
            message: 'L\'email doit contenir un "@"',
        };
    }

    return {
        success: true,
        message: `Merci pour votre message !`,
    };
}
