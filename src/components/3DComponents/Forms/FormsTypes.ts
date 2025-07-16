import {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    MouseEvent,
    SetStateAction,
} from 'react';

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
    name?: string;
    email?: string;
    message?: string;
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

export type handleKeyDownProps = {
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;
    isMultiline?: boolean;
};

export type handleChangeProps = {
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    setFormData: ThreeDFormComponent['setFormData'];
};

export type handleBlurProps = {
    e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>;
    setIsEditing: (isEditing: boolean) => void;
    setFocused: (focused: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
    isEditing: boolean;
    focused: boolean;
};

export type handleSubmitProps = {
    e: React.FormEvent<HTMLFormElement>;
    isSubmitting: boolean;
    formData: ContactFormData;
    retry?: number;
} & ThreeDFormComponent['eventProps'];

export type eventTypeProps = {} | Omit<ThreeDFormComponent, 'eventProps'>;

export type ThreeDFormProps = {
    setIsFormActive?: (active: boolean) => void;
    navigate?: (path: string) => void;
};

/**
 * ThreeDFormMessage Props
 */
export type ThreeDFormMessageProps = {} & Omit<
    ThreeDFormComponentData,
    'isFormValid'
>;

/**
 * ThreeDForm Component Setters
 */
export type ThreeDFormComponentSetters = {
    setFormData: Dispatch<SetStateAction<ContactFormData>>;
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

/**
 * ThreeDForm Component Data
 */
export type ThreeDFormComponentData = {
    formData: ContactFormData;
    isSubmitting: boolean;
    isFormValid: {
        isValid: boolean;
        errors: Record<string, string>;
    };
};

export interface ThreeDFormComponent
    extends ThreeDFormProps,
        ThreeDFormComponentSetters,
        ThreeDFormComponentData {
    eventProps?: eventTypeProps;
}

export type formEventsProps = {
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown: (
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};
