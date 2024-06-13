'use client'

import Link from "next/link";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'

import { useState, useEffect } from "react";
import { isDesktop } from "react-device-detect";

import SideBarMobile from "../../frontend/components/sidebar-mobile";
import { getNavigationsHashURL, getNavigationsURL } from "../../frontend/utils/routes";
import { navigations } from "../../frontend/constants/navigations";
import TopNavigationBar from "../../frontend/components/top-navigation-bar";
import LicenseFooter from "../../frontend/components/license-footer";

export default function Page() {
  const searchParams = useSearchParams();
  const teaCeremony = searchParams.get('tea_ceremony');
  const isInvitedToTeaCeremony = teaCeremony && teaCeremony === "yes";

  const [openSideBar, setOpenSideBar] = useState(false);
  const [isOnDesktop, setIsOnDesktop] = useState(false); // work around for react-device-detect

  useEffect(() => {
    if (isDesktop) {
        setIsOnDesktop(true);
    }
  }, []);

  const getWebNavigations = () => {
    const navs = navigations(isInvitedToTeaCeremony);

    if (isOnDesktop && navs.findIndex((opt) => opt.label === "GAME") <= -1) {
      navs.push({
        label: "GAME" ,
        url: getNavigationsURL(isInvitedToTeaCeremony, 'game'),
      });
    }

    return navs;
  };

    return (
      <div className="min-w-[320px] h-screen w-screen overflow-hidden relative bg-gradient-to-b from-blue-sky from-30% to-blue-pastel">
        <TopNavigationBar navigations={getWebNavigations()} isInvitedToTeaCeremony={isInvitedToTeaCeremony} />
        <div 
          className="z-50 p-3 m-3 fixed bg-blue-dark/50 rounded-full md:hidden"
          onClick={() => { setOpenSideBar(true) }}
        >
          <Image
            className="text-white"
            src="/hamburger-icon.svg"
            alt="navigations"
            width={25}
            height={25}
          />
        </div>
        <div className="relative">
          <Image
            className="absolute z-30 left-[50%] transform -translate-x-1/2 max-w-[350px] w-full h-auto block md:hidden "
            src="/flag-logo.svg"
            alt="Adam and Brenda Wedding Campaign Logo"
            priority
            width={644}
            height={620}
          />
          <Image
            className="absolute animate-loopRightToLeftSlow w-full h-auto max-w-[419px]"
            src="/cloud-1.png"
            alt="cloud BG"
            width={419}
            height={419}
          />
          <Image
            className="absolute animate-loopRightToLeftSlower top-20 w-full h-auto max-w-[450px]"
            src="/cloud-2.png"
            alt="cloud BG"
            width={450}
            height={450}
          />
          <Image
            className="absolute animate-loopRightToLeft hidden md:block w-full h-auto max-w-[450px]"
            src="/cloud-2.png"
            alt="cloud BG"
            width={450}
            height={450}
          />
          <Image
            className="absolute animate-loopRightToLeft top-50 w-full h-auto max-w-[419px]"
            src="/cloud-3.png"
            alt="cloud BG"
            width={419}
            height={419}
          />
        </div>
        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="max-w-[450px] max-h-[413px] bg-[url('/square-speechbox.png')] bg-contain bg-no-repeat bg-center min-w-[287px] min-h-[263px] z-40 p-5 pb-20 flex flex-col justify-center text-center mb-6 md:mb-0 "> 
            <div className="max-w-[280px] text-blue-black">
              <p className="font-bold text-4xl mb-3">Thank you for your response!</p>
              <p className="hidden md:block">See you on our big day!</p>
              <div className="block md:hidden">
                <p className="inline-block">See you on&nbsp;</p>
                {
                  isInvitedToTeaCeremony
                    ? (
                      <Link
                        href={getNavigationsHashURL(isInvitedToTeaCeremony, 'schedule')}
                        className="underline inline-block text-primary"
                      >
                        <p className="font-bold">8th and/or 9th June 2024&nbsp;</p>
                      </Link>
                    ) : (
                      <Link
                        href={getNavigationsHashURL(isInvitedToTeaCeremony, 'schedule')}
                        className="underline inline-block text-primary"
                      >
                        <p className="font-bold">Saturday, 8th June 2024&nbsp;</p>
                      </Link>
                    )
                }
                <p className="inline-block">at&nbsp;</p>
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://maps.app.goo.gl/9W6jay7gR19NenCk6"
                  className="underline inline-block text-primary"
                >
                  <p className="font-bold">
                    No.1, Jalan XXXXX XX, XXXXXXX XXXXXXXXX, XXXXX XXXXXXX XXXX, XXXXXXXX.
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-[1000px] flex items-baseline justify-center md:justify-between">
            {
              isInvitedToTeaCeremony ? (
                <Link
                  className="hidden md:block hover:drop-shadow-glow"
                  href={getNavigationsHashURL(isInvitedToTeaCeremony, 'schedule')}
                >
                  <Image
                    className="w-[225px] h-auto max-w-[300px] mr-5"
                    src="/signboard-datetime-tc.svg"
                    alt="Wedding date and time"
                    priority
                    width={225}
                    height={281}
                  />
                </Link>
              ) : (
                <Image
                  className="hidden md:block w-[225px] h-auto max-w-[300px] mr-5"
                  src="/signboard-datetime.svg"
                  alt="Wedding date and time"
                  priority
                  width={225}
                  height={281}
                />
              )
            }
            <Image
              src="/couple-sprite.gif"
              alt="Adam and Brenda sprites"
              className="w-full h-auto min-w-[217px] max-w-[250px] md:max-w-[270px] lg:mx-5"
              width={270}
              height={135}
            />
            <Link
              className="hidden md:block hover:drop-shadow-glow"
              rel="noopener noreferrer"
              target="_blank"
              href="https://maps.app.goo.gl/9W6jay7gR19NenCk6"
            >
              <Image
                src="/signboard-address-interactable.svg"
                alt="Wedding address"
                priority
                className="h-auto w-[281px] max-w-[300px]"
                width={288}
                height={281}
              />
            </Link>
          </div>
          <div className="min-w-[320px] bg-[url('/floor-textile.svg')] bg-cover bg-repeat-x w-screen h-[50px] md:h-[100px]" />
          <LicenseFooter />
        </div>
        <SideBarMobile open={openSideBar} items={getWebNavigations()} onClose={() => { setOpenSideBar(false) }} />
      </div>
    )
  }