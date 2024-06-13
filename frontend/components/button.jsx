import React from "react";
import PropTypes from "prop-types";
import LoadSpinner from "./load-spinner";

export default function Button(props) {
    const {
        loading = false,
        disabled = false,
        type = "primary",
        children = "Button",
        size = "medium",
        onClick = () => {},
        ...rest
    } = props;

    const getTypeStyle = () => {
        if (type === 'primary') {
            return "bg-primary btn-primary-effect text-white hover:bg-primary-light hover:shadow-none disabled:bg-blue-ash disabled:text-gray-300 disabled:shadow-none disabled:drop-shadow-none";
        }
        return "border-solid border-[1px] border-white hover:border-blue-lavender hover:text-blue-lavender disabled:border-gray-300 disabled:text-gray-300";
    };

    const handleOnClick = () => {
        if (!loading && !disabled) {
            onClick();
        }
    };

    return (
        <button
            {...rest}
            type="button"
            disabled={disabled || loading}
            className={`rounded-[10px] p-4 flex items-center justify-center ${size === "medium" ? "h-[40px] min-w-[100px]" : "h-[30px] min-w-[80px]"}  ${getTypeStyle()} ${loading ? "flex items-center justify-center" : ""}`}
            onClick={handleOnClick}
        >
            { loading ? <div className={`${size === "medium" ? "w-[30px] h-[30px]" : "w-[20px] h-[20px]"}`}><LoadSpinner /></div> : children }
        </button>
    );
};

Button.propTypes = {
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(["primary", "secondary"]),
    size: PropTypes.oneOf(["medium", "small"]),
    children: PropTypes.string,
    onClick: PropTypes.func,
};