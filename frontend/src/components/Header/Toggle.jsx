import { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";

function Toggle({ className = "" }) {
    const darkIcon = HTMLReactParser(
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"            stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
    );

    const darkProps = `bg-gray-700 translate-x-full`;

    const lightIcon = HTMLReactParser(
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
    );
    const lightProps = `bg-yellow-500 -translate-x-2`;

    const localTheme = localStorage.getItem("localTheme");

    const [theme, setTheme] = useState(localTheme);
    const [icon, setIcon] = useState(darkIcon);
    const [props, setProps] = useState(darkProps);

    useEffect(() => {
        theme ? null : setTheme("dark");
        const html = document.querySelector("html");
        html.classList.remove("dark", "light");
        html.classList.add(theme);
        localStorage.setItem("localTheme", theme);

        if (theme === "dark") {
            setProps(darkProps);
            setTimeout(() => {
                setIcon(darkIcon);
            }, 250);
        } else {
            setProps(lightProps);
            setTimeout(() => {
                setIcon(lightIcon);
            }, 250);
        }
    }, [theme]);

    return (
        <>
            <div className={`${className}`}>
                <button
                    className="w-10 h-5 rounded-full m-2 bg-slate-500 flex items-center transition duration-300 focus:outline-none shadow"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    <div
                        className={`w-6 h-6 relative rounded-full transition duration-500 transform p-1 text-white ${props}`}
                    >
                        {icon}
                    </div>
                </button>
            </div>
        </>
    );
}

export default Toggle;
