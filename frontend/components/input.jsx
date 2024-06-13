import React from "react";
import PropTypes from "prop-types";

export default function Input(props) {
    const {
        label = "",
        className = "",
        error = "",
        required = false,
        ...rest
    } = props;

    return (
        <div className={className}>
            { label && <label className={`inline-block mb-1 ${required ? "required-text" : ""}`}>{ label }</label> }
            <div>
                <input className="w-full text-black px-1" required={required} {...rest} />
                <p className="text-red-500 text-xs mt-1">
                    { error || '' }
                </p>
            </div>
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
};