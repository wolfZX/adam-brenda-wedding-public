import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";

export default function SideBarMobile(props) {
    const {
        open = false,
        items = [],
        onClose = () => {},
    } = props;

    const sideBarRef = useRef(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutOfModal = (e) => {
            if (open && sideBarRef.current && !sideBarRef.current.contains(e.target)) {
                onClose();
                if (document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = "";
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutOfModal);

        () => {
            document.removeEventListener("mousedown", handleClickOutOfModal);
        };
    }, [
        open,
        sideBarRef,
        onClose,
    ]);

    const handleOnClose = () => {
        onClose();
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = "";
        }
    };

    return (
        <div className="md:hidden ">
            <div
                ref={sideBarRef}
                className={`transition-[margin-left] ease-in-out duration-500 ${open ? 'ml-0' : 'ml-[-100%]'} fixed top-0 bottom-0 left-0 w-[80%] z-50 h-full overflow flex flex-col bg-blue-mid text-white`}
            >
                <Image
                    priority
                    className="mb-8 mt-8 w-[200px] self-center"
                    src="/full-logo-white.png"
                    alt="Logo"
                    sizes="100vw"
                    width={300}
                    height={244}
                />
                { 
                    items.map((item) => (
                        <Link key={item.label} href={item.url} onClick={handleOnClose} className="h-12 p-5 flex items-center border-b border-blue-grey active:bg-blue-grey">
                            { item.label }
                        </Link>
                    ))
                }
            </div>
            <div className={`fixed top-0 bg-black bg-opacity-50 w-full h-full z-40 ${open ? 'block' : 'hidden'} transition-[display] ease-in-out duration-500`} />
        </div>
    );
};

SideBarMobile.propTypes = {
    open: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
    })),
    onCancel: PropTypes.func,
};