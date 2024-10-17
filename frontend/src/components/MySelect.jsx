import { forwardRef, useId } from "react";

function MySelect(
    {
        className = "",
        optionClassName = "",
        options = [],
        label,
        placeholder,
        required = false,
        ...rest
    },
    ref
) {
    const id = useId();
    return (
        <>
            <div className="w-full flex flex-col items-start">
                {label && (
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}&nbsp;
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={`mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 text-gray-700 dark:bg-gray-800 dark:text-white ${className}`}
                    {...rest}
                >
                    {placeholder && (
                        <option value={placeholder} disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option, index) => {
                        if (typeof option === "object") {
                            return (
                                <option
                                    key={index}
                                    value={option.value}
                                    className={`${
                                        option.className && option.className
                                    } ${optionClassName}`}
                                >
                                    {option.label}
                                </option>
                            );
                        } else
                            return (
                                <option
                                    key={index}
                                    value={option}
                                    className={optionClassName}
                                >
                                    {option}
                                </option>
                            );
                    })}
                </select>
            </div>
        </>
    );
}

export default forwardRef(MySelect);
