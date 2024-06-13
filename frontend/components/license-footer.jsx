'use client'

import Image from "next/image";
import Link from "next/link";

export default function LicenseFooter() {
    return (
        <div className="bg-blue-dark py-5 w-full text-gray-300 text-xs text-center">
            <span property="dct:title">Adam and Brenda Wedding Campaign</span>
            &nbsp;by&nbsp;
            <Link
                rel="cc:attributionURL dct:creator"
                property="cc:attributionName"
                href="http://www.linkedin.com/in/brenda-nhw"
                className="underline hover:text-primary"
            >
                Brenda Ng
            </Link>
            &nbsp;is licensed under&nbsp;
            <Link
                href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
                target="_blank"
                rel="license noopener noreferrer"
                className="inline-block"
            >
                <p className="underline text-xs mr-1 hover:text-primary inline-block">CC BY-SA 4.0</p>
                <Image
                    className="inline-block"
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                    alt=""
                    width={22}
                    height={22}
                />
                <Image
                    className="inline-block"
                    src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                    alt=""
                    width={22}
                    height={22}
                />
                <Image
                    className="inline-block"
                    src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
                    alt=""
                    width={22}
                    height={22}
                />
            </Link>
      </div>
    );
}