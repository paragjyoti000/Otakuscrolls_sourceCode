const Button = ({ onClick, children, className = "", ...rest }) => {
    return (
        <button
            onClick={onClick}
            className={`px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded sm:rounded-md text-xs sm:text-base transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white dark:text-white ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
