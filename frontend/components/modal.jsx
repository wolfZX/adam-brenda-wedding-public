import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import LoadSpinner from "./load-spinner";
import Button from "./button";

export default function Modal(props) {
    const {
        open = false,
        loading = false,
        hideCancel = false,
        title = "",
        content = null,
        onClose = () => {},
        onConfirm = () => {},
    } = props;

    const modalRef = useRef(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutOfModal = (e) => {
            if (!loading && open && modalRef.current && !modalRef.current.contains(e.target)) {
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
        loading,
        open,
        modalRef,
        onClose,
    ]);

    const handleOnConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    const handleOnClose = () => {
        if (!loading) {
            onClose();
            if (document.body.style.overflow === 'hidden') {
                document.body.style.overflow = "";
            }
        }
    };

    return (
        <div className={`fixed top-0 bg-black bg-opacity-50 w-full h-full z-50 ${open ? 'block' : 'hidden'}`}>
            <div
                ref={modalRef}
                className="fixed top-[50%] left-[50%] p-2 md:p-4 rounded-3xl min-w-[300px] bg-[linear-gradient(to_right,theme(colors.blue.neon),theme(colors.blue.lavender),theme(colors.blue.neon),theme(colors.blue.lavender),theme(colors.blue.neon))]"
                style={{
                    transform: "translate(-50%, -50%)",
                 }}
            >
                <div className="p-4 rounded-2xl bg-primary-dark text-white max-h-[550px] overflow-auto">
                    {
                        !loading ? (
                            <>
                                <div className="flex justify-end">
                                    <button type="button" onClick={handleOnClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="header">{ title }</h3>
                                { content }
                                <div className="mt-8 flex items-center justify-center gap-5">
                                    <Button loading={loading} onClick={handleOnConfirm}>Confirm</Button>
                                    {
                                        !hideCancel && 
                                        <Button type="secondary" loading={loading} onClick={handleOnClose}>Cancel</Button>
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-[50px] h-[50px] mb-2">
                                    <LoadSpinner />
                                </div>
                                Loading ...
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    hideCancel: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.node,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};