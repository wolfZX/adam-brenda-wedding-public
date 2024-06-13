'use client'

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";

import SideBarMobile from "../frontend/components/sidebar-mobile";
import Modal from "../frontend/components/modal";
import LicenseFooter from "../frontend/components/license-footer";
import { getNavigationsHashURL, getNavigationsURL } from "../frontend/utils/routes";
import TopNavigationBar from "../frontend/components/top-navigation-bar";
import { navigations } from "../frontend/constants/navigations";
import { firstDaySchedule, secondDaySchedule } from "../frontend/constants/schedules";
import { getLocalStorage, setLocalStorage } from "../frontend/utils/localstorage";

export default function Page() {
  const searchParams = useSearchParams();
  const teaCeremony = searchParams.get('tea_ceremony');
  const isInvitedToTeaCeremony = teaCeremony && teaCeremony === "yes";

  const [openSideBar, setOpenSideBar] = useState(false);
  const [navHaveBgColor, setNavHaveBgColor] = useState(false);
  const [isOnDesktop, setIsOnDesktop] = useState(false); // work around for react-device-detect
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    if (isDesktop) {
        setIsOnDesktop(true);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);

      if (hash.length && document.getElementById(hash)) {
        document.getElementById(hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  useEffect(() => {
    const changeNavBackground = () => {
      if (window.scrollY >= 80) {
        setNavHaveBgColor(true);
      } else {
        setNavHaveBgColor(false);
      }
    };

    window.addEventListener('scroll', changeNavBackground, true);
    return () => window.removeEventListener('scroll', changeNavBackground);
  }, []);

  useEffect(() => {
    const newNoticeLS = getLocalStorage(window.localStorage, 'newNotice');
    if (newNoticeLS != "time changed") {
      setModalState(true);
    }
  }, []);

  const getRSVPURL = (side) => {
    let url = `/rsvp?side=${side}`;

    if (isInvitedToTeaCeremony) {
      url = `/rsvp?side=${side}&tea_ceremony=yes`
    }

    return url;
  };

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

  const handleCloseModal = () => {
    setModalState(false);
    setLocalStorage(window.localStorage, 'newNotice', "time changed");
  };

    return (
      <div className="min-w-[320px]">
        <div className="h-screen w-screen min-w-[320px] max-h-[915px] overflow-hidden relative bg-gradient-to-b from-blue-sky from-30% to-blue-pastel">
          <TopNavigationBar navigations={getWebNavigations()} isInvitedToTeaCeremony={isInvitedToTeaCeremony} showBG={navHaveBgColor} />
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
              className="absolute z-30 left-[50%] transform -translate-x-1/2 max-w-[350px] md:max-w-[600px] w-full h-auto"
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
          <div className="absolute bottom-0 flex flex-col items-center text-blue-black">
            <div className="bg-[url('/square-speechbox.png')] bg-contain bg-no-repeat bg-center min-w-[287px] min-h-[263px] z-40 mb-6 p-5 pb-16 flex flex-col justify-center text-center md:hidden max-w-[250px]"> 
              <p className="font-semibold">We are leveling up together on</p>
              {
                isInvitedToTeaCeremony ? (
                  <>
                    <p className="font-bold text-2xl">8th June 2024</p>
                    <p className="font-semibold">and we will be hosting a Tea Ceremony on</p>
                    <p className="font-bold text-2xl">9th June 2024</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-2xl">Saturday,</p>
                    <p className="font-bold text-2xl">8th June 2024!</p>
                  </>
                )
              }
            </div>
            <div className="flex items-baseline justify-center md:justify-between max-w-[1000px]">
              {
                isInvitedToTeaCeremony ? (
                  <Link
                    className="hidden md:block hover:drop-shadow-glow"
                    href={getNavigationsHashURL(isInvitedToTeaCeremony, 'schedule')}
                  >
                    <Image
                      className="w-[225px] h-auto max-w-[234px] mr-5"
                      src="/signboard-datetime-tc.svg"
                      alt="Wedding date and time"
                      priority
                      width={225}
                      height={281}
                    />
                  </Link>
                ) : (
                  <Image
                    className="w-[225px] h-auto max-w-[234px] hidden mr-5 md:block"
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
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-grey via-blue-mid via-40% to-blue-dark flex flex-col items-center">
          <section
            id="info"
            className="flex md:hidden mt-8 w-full max-w-[1000px] text-blue-dark text-center flex-col items-center pt-16 pb-20 px-10 bg-[url('/notice-board-square.jpg')] bg-contain bg-center bg-no-repeat">
            <h1 className="header border-blue-dark w-full max-w-[240px]">Info</h1>
            {
              isInvitedToTeaCeremony ? (
                <>
                  <p>Wedding reception:</p>
                  <p className="font-semibold">8th June 2024, 1 PM till 5 PM</p>
                  <p>Tea ceremony:</p>
                  <p className="font-semibold">9th June 2024, 9 AM till 3 PM</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Saturday, 8th June 2024,</p>
                  <p className="font-semibold">1 PM till 5 PM</p>
                </>
              )
            }
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href="https://maps.app.goo.gl/9W6jay7gR19NenCk6"
              className="inline-block font-semibold text-primary hover:underline mt-3"
            >
              <p>No.1, Jalan XXXXX XX,</p>
              <p>XXXXXXX XXXXXXXXX,</p>
              <p>XXXXX XXXXXXX XXXX, XXXXXXXX.</p>
            </Link>
          </section>
          <section id="our_story" className="container mt-4 max-w-[1000px]">
            <div className="rounded-3xl p-2 md:p-4 bg-[linear-gradient(to_right,theme(colors.blue.neon),theme(colors.blue.lavender),theme(colors.blue.neon),theme(colors.blue.lavender),theme(colors.blue.neon))]">
              <div className="p-4 rounded-2xl bg-primary-dark text-white">
                <h1 className="header">Our story</h1>
                <div className="mb-8 text-center flex flex-col items-center md:text-left md:flex-row-reverse">
                  <p>Adam and Brenda first met in the year 2019 while working in the same company. However, due to Brenda&apos;s introverted personality and nature of zoning out while working, their story only blooms later on.</p>
                  <Image
                    className="mt-3 w-full h-auto max-w-[200px]"
                    src="/our-story-1.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="mb-8 text-center flex flex-col items-center md:text-right md:flex-row">
                  <p>After discovering their shared interests in games, they started hanging out more with each other. At lunch break, they would play all sorts of party games on the Nintendo Switch and when they reached home, they would spend time “carrying” each other on Overwatch.</p>
                  <Image
                    className="w-full h-auto max-w-[200px] mt-3 md:pl-3"
                    src="/our-story-2.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="mb-8 text-center flex flex-col items-center md:text-left md:flex-row-reverse">
                  <p>Over time, just like Adam’s winning streak over Brenda in &quot;Super Smash Bros. Ultimate&quot;, their relationship grew and Adam fell in love with Brenda. What started as a simple interest for her cute exterior, their time spent together made Adam fell more and more in love with who Brenda is. A carefree and kind person.</p>
                  <Image
                    className="w-full h-auto max-w-[200px] mt-3"
                    src="/our-story-3.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="mb-8 text-center flex flex-col items-center md:text-right md:flex-row">
                  <p>Unbeknownst to Adam, Brenda has also been charmed by Adam’s friendly and kind attitude. She started developing feelings for him after Adam made homemade Honey Lemon Tea for her while she was sick. This proved to Brenda that Adam wasn’t just a sweet talker but also a man of action.</p>
                  <Image
                    className="w-full h-auto max-w-[200px] mt-3 md:pl-3"
                    src="/our-story-4.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="mb-8 text-center flex flex-col items-center md:text-left md:flex-row-reverse">
                  <p>With a little push from some of his friends at work, Adam eventually mustered up the courage to confess his true feelings to Brenda. Initially declining as she was not prepared to be in a relationship at the time, all it took was 10 days to pass before Brenda uttered the words, “Let’s give it a try.”</p>
                  <Image
                    className="w-full h-auto max-w-[200px] mt-3"
                    src="/our-story-5.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="mb-8 text-center flex items-center flex-col">
                  <p>...and finally, here we are now!</p>
                  <Image
                    className="w-full h-auto max-w-[200px] my-3"
                    src="/our-story-6.png"
                    alt="Our story graphic"
                    width={200}
                    height={100}
                  />
                  <div className="max-w-full max-h-full h-[300px] w-full flex justify-center items-center border-dashed border-2 border-grey-300">
                    <h3>Our prewedding photo was here.</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="schedule" className="container p-4 mt-4 text-white max-w-[1000px]">
            <h1 className="header">Schedule</h1>
            <section className="flex flex-col text-center">
                <h3 className="mb-4">{`- Saturday, 8th June 2024 ${isInvitedToTeaCeremony ? '(Wedding reception)' : ''} -`}</h3>
                {
                    firstDaySchedule.map((schedule) => (
                      <span key={schedule.event}>
                        <p className="text-base mt-4">{ schedule.time }</p>
                        {
                          Array.isArray(schedule.event) ? (
                            schedule.event.map((event) => (<p key={event} className="font-bold">{ event }</p>))
                          ) : (
                            <p className="font-bold">{ schedule.event }</p>
                          )
                        }
                      </span>
                    ))
                }
            </section>

            {
                isInvitedToTeaCeremony && (
                    <section className="mt-8 flex flex-col text-center">
                      <h3 className="mb-4">{`- Sunday, 9th June 2024 ${isInvitedToTeaCeremony ? '(Tea ceremony)' : ''} -`}</h3>
                        {
                            secondDaySchedule.map((schedule) => (
                              <span key={schedule.event}>
                                <p key={schedule.time} className="text-base mt-4">{ schedule.time }</p>
                                <p key={schedule.event} className="font-bold">{ schedule.event }</p>
                              </span>
                            ))
                        }
                    </section>
                )
            }
          </section>
          <section id="rsvp" className="container p-4 mt-4 text-white text-center max-w-[1000px]">
            <h1 className="header mb-8">Which side are you from?</h1>
            <div className="flex justify-center gap-5">
              <Link href={getRSVPURL('groom')}>
                <Image
                  className="hidden sm:block hover:drop-shadow-glow"
                  src="/groom-card.png"
                  alt="from groom side"
                  priority
                  sizes="(max-width: 768px) 380px, 520px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '520px',
                  }}
                  width={520}
                  height={780}
                />
                <Image
                  className="block sm:hidden hover:drop-shadow-glow"
                  src="/groom-card-mobile.png"
                  alt="from groom side"
                  priority
                  sizes="(max-width: 768px) 380px, 520px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '520px',
                  }}
                  width={520}
                  height={780}
                />
              </Link>
              <Link href={getRSVPURL('bride')}>
                <Image
                  className="hidden sm:block hover:drop-shadow-glow"
                  src="/bride-card.png"
                  alt="from bride side"
                  priority
                  sizes="(max-width: 768px) 380px, 520px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '520px',
                  }}
                  width={520}
                  height={780}
                />
                <Image
                  className="block sm:hidden hover:drop-shadow-glow"
                  src="/bride-card-mobile.png"
                  alt="from bride side"
                  priority
                  sizes="(max-width: 768px) 380px, 520px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '520px',
                  }}
                  width={520}
                  height={780}
                />
              </Link>
            </div>
          </section>
          <LicenseFooter />
        </div>
        <Modal
          hideCancel
          open={modalState}
          title="Time Schedule Changed"
          content={(
            <p className="my-4">
              Attention! Our schedule for 8th June 2024 have a slight time change to make sure we bring a smoother experience for our guest.
              <br />
              <br />
              We&apos;ve delayed from &quot;12 PM - 4 PM&quot; to &quot;1 PM - 5 PM&quot;.
              You can always refer back the updated time in the &quot;Schedule&quot; section.
            </p>
          )}
          onConfirm={handleCloseModal}
          onClose={handleCloseModal}
        />
        <SideBarMobile open={openSideBar} items={getWebNavigations()} onClose={() => { setOpenSideBar(false) }} />
      </div>
    )
  }