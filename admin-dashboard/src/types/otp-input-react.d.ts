declare module 'otp-input-react' {
    import React from 'react';

    interface OtpInputProps {
        value: string;
        onChange: (otp: string) => void;
        OTPLength: number;
        otpType?: 'number' | 'alpha' | 'alphanumeric';
        disabled?: boolean;
        autoFocus?: boolean;
        className?: string;
        isInputNum?: boolean;
        isInputSecure?: boolean;
        inputStyle?: React.CSSProperties;
        focusStyle?: React.CSSProperties;
        separator?: React.ReactNode;
    }

    const OtpInput: React.FC<OtpInputProps>;

    export default OtpInput;
}
