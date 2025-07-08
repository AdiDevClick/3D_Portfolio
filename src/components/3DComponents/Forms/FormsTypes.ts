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
