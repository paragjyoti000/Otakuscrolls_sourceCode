import { Link } from "react-router-dom";
import OtakuScrolls_light from "../assets/otakuscrolls_light.png";
import OtakuScrolls_dark from "../assets/otakuscrolls_dark.png";

function Logo({ className = "" }) {
    return (
        <>
            <Link to="/" className={`${className} `}>
                <img
                    src={OtakuScrolls_dark}
                    alt="OtakuScrolls"
                    width="100%"
                    className="hidden dark:block"
                />
                <img
                    src={OtakuScrolls_light}
                    alt="OtakuScrolls"
                    width="100%"
                    className="block dark:hidden"
                />
            </Link>
        </>
    );
}

export default Logo;
