import React from "react";
import PropTypes from "prop-types";

export default function ButtonSquareOutlined(props) {
    const {
        disabled = false,
        children = "Button",
        onClick = () => {},
        ...rest
    } = props;

    const handleOnClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    return (
        <button
            {...rest}
            type="button"
            disabled={disabled}
            className="h-[30px] w-[30px] border-solid border-[1px] border-white hover:border-blue-lavender hover:text-blue-lavender disabled:border-gray-300 disabled:text-gray-300"
            onClick={handleOnClick}
        >
            { children }
        </button>
    );
};

ButtonSquareOutlined.propTypes = {
    disabled: PropTypes.bool,
    children: PropTypes.string,
    onClick: PropTypes.func,
};