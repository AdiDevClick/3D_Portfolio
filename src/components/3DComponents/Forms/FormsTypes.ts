export type handleClickProps = {
    e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>;
    isEditing: boolean;
    focused: boolean;
    setIsEditing: (isEditing: boolean) => void;
    setFocused: (focused: boolean) => void;
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
};

export type formState = {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    focused: boolean;
    setFocused: (focused: boolean) => void;
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
    value: string;
    setValue: (value: string) => void;
};

export interface Button3DProps {
    position: [number, number, number];
    onClick: () => void;
    disabled?: boolean;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    number?: string;
    retry: number;
    success: boolean;
    failed: boolean;
}

export interface Input3DProps {
    position: [number, number, number];
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    fieldName: keyof ContactFormData;
    isMultiline?: boolean;
}
