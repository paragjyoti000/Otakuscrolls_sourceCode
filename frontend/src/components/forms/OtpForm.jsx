import { useEffect, useRef, useState } from "react";

function OtpForm({ length = 4, serverOTP, onSubmit = () => {} }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [otpError, setOtpError] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, []);

    const handleOnChange = (e, index) => {
        const value = e.target.value;

        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);

        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            if (
                serverOTP &&
                combinedOtp === serverOTP.otp &&
                new Date().getTime() < serverOTP.expireIn
            ) {
                onSubmit(combinedOtp);
                return;
            } else {
                setOtpError("Invalid OTP or OTP expired. Please try again.");
            }
        }

        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOnClick = (e, index) => {
        inputRefs.current[index].setSelectionRange(1, 1); // set cursor at the end();

        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleOnKeyDown = (e, index) => {
        if (
            e.key === "Backspace" &&
            index > 0 &&
            !otp[index] &&
            inputRefs.current[index - 1]
        ) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        OTP Verification
                    </h2>

                    <div className="flex items-center justify-center space-x-3">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                className="md:w-14 md:h-14 w-10 h-10 p-3 text-center md:text-xl text-lg font-bold rounded border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-cyan-950"
                                type="text"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={value}
                                onChange={(e) => handleOnChange(e, index)}
                                onClick={(e) => handleOnClick(e, index)}
                                onKeyDown={(e) => handleOnKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <p className="text-center mt-4">
                        Enter the OTP sent to your registered email address
                    </p>
                    {otpError && (
                        <>
                            <br />
                            <p className="text-red-500 text-center">
                                {otpError}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default OtpForm;
