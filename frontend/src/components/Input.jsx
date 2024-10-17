import { forwardRef, useId, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

function Input(
    {
        label,
        type = "text",
        className = "",
        onChange,
        required = false,
        ...rest
    },
    ref
) {
    const [inputType, setInputType] = useState("password");
    const id = useId();

    return (
        <>
            <div className="relative w-full flex flex-col items-start">
                {label && (
                    <label
                        htmlFor={id}
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}&nbsp;
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    type={type === "password" ? inputType : type}
                    className={`block w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white ${className}`}
                    onChange={onChange}
                    {...rest}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => {
                            setInputType(
                                inputType === "password" ? "text" : "password"
                            );
                        }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        {inputType === "password" ? <FaEye /> : <FaEyeSlash />}
                    </button>
                )}
            </div>
        </>
    );
}

export default forwardRef(Input);
