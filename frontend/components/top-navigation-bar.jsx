import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

export default function TopNavigationBar(props) {
    const {
        showBG = false,
        navigations = [],
    } = props;

    return (
        <div className={`hidden z-50 md:flex py-4 pl-4 pr-8 fixed w-screen gap-5 justify-end text-white font-semibold transition-colors ease-in-out duration-500 ${showBG ? 'bg-blue-dark/50' : ''}`}>
            {
              navigations.map((nav) => (
                <Link key={nav.label} href={nav.url} className={`hover:underline hover:text-primary ${nav.label === "INFO" ? 'md:hidden' : ''}`}>
                  { nav.label }
                </Link>
              ))
            }
        </div>
    );
};

TopNavigationBar.propTypes = {
    showBG: PropTypes.bool,
    navigations: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
    })),
};