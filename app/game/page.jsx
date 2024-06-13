'use client'

import { useSearchParams } from 'next/navigation'
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { isDesktop } from "react-device-detect";

import useInterval from "../../frontend/utils/useInterval";
import Button from "../../frontend/components/button";
import { getLocalStorage, setLocalStorage } from "../../frontend/utils/localstorage";
import { navigations } from "../../frontend/constants/navigations";
import SideBarMobile from '../../frontend/components/sidebar-mobile';
import Image from 'next/image';
import ButtonGameArrows from '../../frontend/components/button-square-outlined';
import TopNavigationBar from '../../frontend/components/top-navigation-bar';
import { getNavigationsURL } from '../../frontend/utils/routes';
import LicenseFooter from '../../frontend/components/license-footer';

export default function Page() {
    const searchParams = useSearchParams();
    const teaCeremony = searchParams.get('tea_ceremony');
    const isInvitedToTeaCeremony = teaCeremony && teaCeremony === "yes";
  
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pause, setPause] = useState(false);
    const [openSideBar, setOpenSideBar] = useState(false);
    const [isOnDesktop, setIsOnDesktop] = useState(false); // work around for react-device-detect
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialPage, setTutorialPage] = useState(1);
    const [counter, setCounter] = useState(3);
    const [score, setScore] = useState("00000");
    const [highScore, setHighScore] = useState("00000");
    const [start, setStart] = useState(false);
    const [win, setWin] = useState(false);
    const [lose, setLose] = useState(false);
    const [abilityOnCD, setAbilityOnCD] = useState(false);
    const [mobMoveSpeed, setMobMoveSpeed] = useState(10);
    const [mobSpawnSpeed, setMobSpawnSpeed] = useState(2000);
    const [moveMobIntervalIDs, setMoveMobIntervalIDs] = useState([]);
    const [pausedMobs, setPausedMobs] = useState([]);

    const coupleSpritesRef = useRef(null);
    const gameStart = start && counter <= 0;
    const startCounter = start && counter > 0;

    useEffect(() => {
        if (isDesktop) {
            setIsOnDesktop(true);
        }
        setIsLoading(false);
    }, []);

    const formatScoreToNumber = (str) =>  (+str) + 1;

    // Counting score based on how long user surived
    // and speed up mob spawn
    const scoreIntervalRef = useInterval(() => {
        if (formatScoreToNumber(score) < 99999) {
            setScore((prev) => {
                const newFormattedScore = (+prev) + 1;
                const newScore = ("00000" + newFormattedScore).slice(-5);

                const maxSpeed = 1;
                const reachMaxSpeed = mobMoveSpeed <= maxSpeed;
                const scoreAchieved = newFormattedScore > 0 && newFormattedScore % 100 === 0;

                if (!reachMaxSpeed && scoreAchieved) {
                    setMobMoveSpeed((prev) => prev - 1);
                }

                return newScore;
            });
        } else {
            window.clearInterval(scoreIntervalRef.current);
            setWin(true);
            setStart(false);
        }
    }, 100, gameStart);
    
    // Count down after user start the game
    const counterIntervalRef = useInterval(() => {
        if (startCounter) {
            setCounter((prev) => prev - 1);
        } else {
            window.clearInterval(counterIntervalRef.current);
        }
    }, 1000, startCounter);

    const moveMob = useCallback((mob, currentPosition) => {
        const gameContainer = document.getElementById('gameContainer');
        let position = !currentPosition ? gameContainer.offsetWidth : currentPosition;
        const moveInterval = setInterval(() => {
            position -= 1;
            mob.style.left = position + 'px';
            if (position < -20) {
                clearInterval(moveInterval);
                mob.remove();
            }
        }, mobMoveSpeed);

        // For removing the interval outside of this function
        setMoveMobIntervalIDs((prev) => {
            const newMoveMobIntervalIDs = prev;
            newMoveMobIntervalIDs.push(moveInterval);
            return newMoveMobIntervalIDs;
        });
    }, [mobMoveSpeed]);

    const isPausedMobPassedCenter = () => {
        if (pausedMobs && pausedMobs.length > 0) {
            const gameContainerWidth = document.getElementById('gameContainer').offsetWidth;
            const lastMobLeft = pausedMobs[pausedMobs.length - 1].offsetLeft;
            const lastMobPositionPercentage = (lastMobLeft / gameContainerWidth) * 100;
            const passed = lastMobPositionPercentage <= 60;
            if (passed) {
                setPausedMobs([]);
            }
            return passed;
        }
        return true;
    } 

    useEffect(() => {
        if (mobMoveSpeed <= 4) {
            setMobSpawnSpeed(1800);
        }

        if (mobMoveSpeed <= 1) {
            setMobSpawnSpeed(1000);
        }
    }, [mobMoveSpeed]);

    // Generate moving mobs
    const createMobInterval = useInterval(() => {
        const gameContainer = document.getElementById('gameContainer');
        const noMorePrevPausedMobs = isPausedMobPassedCenter();

        const createMob = () => {
            const mob = document.createElement('img');
            const mobClassType = Math.random() < 0.5 ? 'bride-mob' : 'groom-mob';
            const mobSrc = mobClassType === 'bride-mob' ? '/bride-mob.gif' : '/groom-mob.gif';
            const spawnPosition = gameContainer.offsetWidth + 3;
            mob.classList.add('absolute');
            mob.classList.add('bottom-0');
            mob.classList.add('right-0');
            mob.classList.add('h-[50px]');
            mob.classList.add('w-[50px]');
            mob.classList.add(mobClassType);
            mob.src = mobSrc;
            mob.style.left = spawnPosition + 'px';
            gameContainer.appendChild(mob);
            moveMob(mob);
        }

        if (gameStart && noMorePrevPausedMobs) {
            createMob();
        } else {
            clearInterval(createMobInterval);
        }
    }, mobSpawnSpeed, gameStart)

    useEffect(() => {
        if (pause) {
            const inViewMobs = document.querySelectorAll('.bride-mob, .groom-mob');
            setPausedMobs(inViewMobs);
        }
    }, [pause]);

    useEffect(() => {
        const allBrideMobs = document.querySelectorAll('.bride-mob');
        const allGroomMobs = document.querySelectorAll('.groom-mob');
        if (allBrideMobs.length > 0) {
            if (!(start && counter <= 0)) {
                allBrideMobs.forEach((mob) => {
                    mob.src = '/bride-mob.png';
                });
            } else {
                allBrideMobs.forEach((mob) => {
                    mob.src = '/bride-mob.gif';
                });
            }
        }
        if (allGroomMobs.length > 0) {
            if (!(start && counter <= 0)) {
                allGroomMobs.forEach((mob) => {
                    mob.src = '/groom-mob.png';
                });
            } else {
                allGroomMobs.forEach((mob) => {
                    mob.src = '/groom-mob.gif';
                });
            }
        }
    }, [start, counter]);

    useEffect(() => {
        if (pausedMobs && pausedMobs.length > 0 && start && counter <= 0) {
            pausedMobs.forEach((mob) => moveMob(mob, mob.offsetLeft));
        }
    }, [pausedMobs, start, counter, moveMob]);

    useEffect(() => {
        if (win || lose || pause) {
            moveMobIntervalIDs.forEach((id) => {
                clearInterval(id);
            })
        }
    }, [win, lose, pause, moveMobIntervalIDs]);

    // Triggers the couple abilities
    useEffect(() => {
        if (!start || counter > 0) {
            return;
        }

        function activateAbility(e) {
            const coupleRef = coupleSpritesRef.current;
            if (start && !!coupleRef && !abilityOnCD) {
                if (["a", "A", "ArrowLeft"].includes(e.key)) {
                    coupleRef.classList.add("bride-ability");
                    setAbilityOnCD(true);
                }

                if (["d", "D", "ArrowRight"].includes(e.key)) {
                    coupleRef.classList.add("groom-ability");
                    setAbilityOnCD(true);
                }
    
                setTimeout(() => {
                    coupleRef.classList.remove("bride-ability");
                    coupleRef.classList.remove("groom-ability");
                }, 500);
            }
        };

        document.addEventListener("keydown", activateAbility);
        return () => document.removeEventListener("keydown", activateAbility);

    }, [start, counter, abilityOnCD]);

    useEffect(() => {
        if (abilityOnCD) {
            setTimeout(() => {
                setAbilityOnCD(false);
            }, 800)
        }
    }, [abilityOnCD]);

    // Get previous high score if have
    useEffect(() => {
        const getHighScore = () => {
            let prevHighScore = "00000"; 
            if (typeof window !== 'undefined') {
                prevHighScore = getLocalStorage(window.localStorage, 'highScore');
            }
            return prevHighScore || "00000";
        };

        const prevHighScore = getHighScore();
        setHighScore(prevHighScore);
    }, []);

    // Set new high score
    useEffect(() => {
        const formattedScore = formatScoreToNumber(score);
        const formattedHighScore = formatScoreToNumber(highScore);
        if ((win || lose) && formattedScore > formattedHighScore) {
            setLocalStorage(window.localStorage, 'highScore', score);
            setHighScore(score);
        }
    }, [win, lose, score, highScore]);

    // Pause when page not in view
    useEffect(() => {
        function onHiddenPause (e) {
            var v = "visible",
                h = "hidden",
                evtMap = {
                    focus:v,
                    focusin:v,
                    pageshow:v,
                    blur:h,
                    focusout:h,
                    pagehide:h,
                };

            if (!Object.prototype.hasOwnProperty.call(evtMap, e.type)) {
                setPause(true);
                setStart(false);
            }
        }

        if (counter <= 0 && !pause && !win && !lose) {
            let hidden = "hidden";
            if (hidden in document) { 
                document.addEventListener("visibilitychange", onHiddenPause);
            } else if ((hidden = "mozHidden") in document) {
                document.addEventListener("mozvisibilitychange", onHiddenPause);
            } else if ((hidden = "webkitHidden") in document) {
                document.addEventListener("webkitvisibilitychange", onHiddenPause);
            } else if ((hidden = "msHidden") in document) {
                document.addEventListener("msvisibilitychange", onHiddenPause);
            } else if ("onfocusin" in document) {
                // IE 9 and lower:
                document.onfocusin = document.onfocusout = onHiddenPause;
            } else {
                // All others:
                window.onpageshow = window.onpagehide
                = window.onfocus = window.onblur = onHiddenPause;
            }
        }

        return () => {
            let hidden = "hidden";
            if (hidden in document) { 
                document.removeEventListener("visibilitychange", onHiddenPause);
            } else if ((hidden = "mozHidden") in document) {
                document.removeEventListener("mozvisibilitychange", onHiddenPause);
            } else if ((hidden = "webkitHidden") in document) {
                document.removeEventListener("webkitvisibilitychange", onHiddenPause);
            } else if ((hidden = "msHidden") in document) {
                document.removeEventListener("msvisibilitychange", onHiddenPause);
            } else if ("onfocusin" in document) {
                // IE 9 and lower:
                document.onfocusin = document.onfocusout = {};
            } else {
                // All others:
                window.onpageshow = window.onpagehide
                = window.onfocus = window.onblur = {};
            }
        }
    }, [counter, pause, win, lose]);

    // Pause using ESC
    useEffect(() => {
        function pauseGame() {
            setPause(true);
            setStart(false);
        }

        function unpauseGame() {
            setCounter(3);
            setPause(false);
            setStart(true);
        }

        function escPause(e) {
            if (e.key === 'Escape') {
                if (!pause) {
                    pauseGame();
                } else {
                    unpauseGame();
                }
            }
        };

        if (counter <= 0 && !win && !lose) {
            document.addEventListener("keydown", escPause);
        }
        return () => {
            document.removeEventListener("keydown", escPause);
        };
    }, [counter, pause, win, lose]);

    const checkCollision = useInterval(() => {
        if (gameStart) {
            const coupleRef = coupleSpritesRef.current;
            const brideMobs = document.querySelectorAll('.bride-mob');
            const groomMobs= document.querySelectorAll('.groom-mob');
    
            const coupleSprites = coupleRef.getBoundingClientRect();
    
            if (coupleSprites) {
                brideMobs.forEach((mob) => {
                    const mobSprite = mob.getBoundingClientRect();
                    const isInHoriztonalBrideMobBounds =
                        coupleSprites.x < mobSprite.x + mobSprite.width && coupleSprites.x + coupleSprites.width > mobSprite.x;
                    const isInVerticalBrideMobBounds =
                        coupleSprites.y < mobSprite.y + mobSprite.height && coupleSprites.y + coupleSprites.height > mobSprite.y;
                    const isBrideMobCollided = isInHoriztonalBrideMobBounds && isInVerticalBrideMobBounds;
    
                    if (isBrideMobCollided) {
                        if (!coupleRef.classList.contains("bride-ability")) {
                            setLose(true);
                            setStart(false);
                        } else {
                            mob.remove();
                        }
                    }
                })
    
                groomMobs.forEach((mob) => {
                    const mobSprite = mob.getBoundingClientRect();
                    const isInHoriztonalGroomMobBounds =
                        coupleSprites.x < mobSprite.x + mobSprite.width && coupleSprites.x + coupleSprites.width > mobSprite.x;
                    const isInVerticalGroomMobBounds =
                        coupleSprites.y < mobSprite.y + mobSprite.height && coupleSprites.y + coupleSprites.height > mobSprite.y;
                    const isGroomMobCollided = isInHoriztonalGroomMobBounds && isInVerticalGroomMobBounds;
    
                    if (isGroomMobCollided) {
                        if (!coupleRef.classList.contains("groom-ability")) {
                            setLose(true);
                            setStart(false);
                        } else {
                            mob.remove();
                        }
                    }
                })
            }
        } else {
            clearInterval(checkCollision);
        }
    }, 50, gameStart);

    const handleOpenTutorial = () => {
        setPage(2);
        setShowTutorial(true);
    }

    const handleStart = () => {
        if (showTutorial) {
            setShowTutorial(false);
        }

        setStart(true);
    };

    const handleTutorialPage = (back) => {
        if (back) {
            if (tutorialPage !== 1) {
                setTutorialPage((prev) => prev - 1);
            }
        } else if (tutorialPage !== 4) {
            setTutorialPage((prev) => prev + 1);
        }
    };

    const handleRetry = () => {
        const brideMobs = document.querySelectorAll('.bride-mob');
        const groomMobs= document.querySelectorAll('.groom-mob');
        brideMobs.forEach((mob) => mob.remove());
        groomMobs.forEach((mob) => mob.remove());

        if (win) {
            setWin(false);
        }

        if (lose) {
            setLose(false);
        }

        setMoveMobIntervalIDs([]);
        setScore("00000");
        setCounter(3);
        setMobMoveSpeed(10);
        setMobSpawnSpeed(2000);
        handleStart();
    };

    const renderTutorial = () => {
        let scene = null;
        switch (tutorialPage) {
            case 1:
                scene = (
                    <>
                        <div className="flex-1 mb-1">
                            <h3>Tutorial</h3>
                            <p className="game-text">Fight back against the approaching monsters with the couple&apos;s abilities</p>
                        </div>
                        <Button onClick={handleTutorialPage} size="small">
                            Next
                        </Button>
                    </>
                );
                break;
            case 2:
                scene = (
                    <>
                        <div className="flex-1 mb-1">
                            <div className="flex justify-center items-center mb-1 gap-2">
                                <Image
                                    priority
                                    src="/tutorial-bride.png"
                                    alt="bride"
                                    width="70"
                                    height="100"
                                />
                                <Image
                                    priority
                                    src="/tutorial-bride-mob.png"
                                    alt="bride mob"
                                    width="70"
                                    height="100"
                                />
                            </div>
                            <p className="game-text">Press A or Left ArrowKey to cast spell on the ghost.</p>
                        </div>
                        <div>
                            <ButtonGameArrows className="border border-white p-1" onClick={() => handleTutorialPage(true)}>&lt;</ButtonGameArrows>
                            <ButtonGameArrows className="border border-white p-1" onClick={handleTutorialPage}>&gt;</ButtonGameArrows>
                        </div>
                    </>
                );
                break;
            case 3:
                scene = (
                    <>
                        <div className="flex-1 mb-1">
                            <div className="flex justify-center items-center mb-1 gap-2">
                                <Image
                                    priority
                                    src="/tutorial-groom.png"
                                    alt="groom"
                                    width="70"
                                    height="100"
                                />
                                <Image
                                    priority
                                    src="/tutorial-groom-mob.png"
                                    alt="groom mob"
                                    width="70"
                                    height="100"
                                />
                            </div>
                            <p className="game-text">Press D or Right ArrowKey to defend from eye monster.</p>
                        </div>
                        <div>
                            <ButtonGameArrows className="border border-white p-1" onClick={() => handleTutorialPage(true)}>&lt;</ButtonGameArrows>
                            <ButtonGameArrows className="border border-white p-1" onClick={handleTutorialPage}>&gt;</ButtonGameArrows>
                        </div>
                    </>
                );
                break;
            case 4:
                scene = (
                    <>
                        <h3 className="mb-4">Ready to play?</h3>
                        <div className="flex items-center justify-center gap-2">
                            <Button type="secondary" size="small" onClick={() => handleTutorialPage(true)}>
                                Back
                            </Button>
                            <Button onClick={handleStart} size="small">
                                Yes
                            </Button>
                        </div>
                    </>
                );
                break;
            default:
                break;
        }
        
        return (
            <div className="absolute w-full h-full text-white flex-col flex items-center p-4 text-center justify-center bg-black bg-opacity-80 z-50">
                { scene }
            </div>
        );
    };

    const renderOverlay = () => {
        switch (true) {
            case pause:
                return (
                    <div className="absolute w-full h-full text-white flex-col flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <h3>Pause</h3>
                        <p className="game-text">Press ESC key to unpause</p>
                    </div>
                );
            case showTutorial:
                return renderTutorial();
            case counter > 0:
                return (
                    <div className="absolute w-full h-full text-white flex-col flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <h3>{ counter }</h3>
                    </div>
                );
            case win:
                return (
                    <div className="absolute w-full h-full text-white flex-col flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <h3 className="mb-2">You won the game!!</h3>
                        <Button size="small" onClick={handleRetry}>Play Again</Button>
                    </div>
                );
            case lose:
                return (
                    <div className="absolute w-full h-full text-white flex-col flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <h3 className="mb-1">Game Over</h3>
                        <p className="game-text mb-2">Your score: { score }</p>
                        <Button size="small" onClick={handleRetry}>Retry</Button>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderCoupleSprite = () => {
        let src = '';
        let width = 98;
        let height = 50;
        const coupleRef = coupleSpritesRef.current;

        if (gameStart) {
            if (coupleRef.classList.contains("groom-ability")) {
                src = '/groom-ability.gif';
                width = 117;
                height = 70;
            } else if (coupleRef.classList.contains("bride-ability")) {
                src = '/bride-ability.gif';
                width = 117;
                height = 70;
            } else {
                src = '/couple-run.gif';
                width = 98;
                height = 50;
            }
        } else {
            src = '/couple-idle.png';
            width = 98;
            height = 50;
        }

        return (
            <Image
                priority
                id="couple-sprites"
                src={src}
                alt="couple sprite"
                className="ml-2"
                width={width}
                height={height}
                style={{
                    width: '100%',
                    height: 'auto',
                }}
            />
        );
    }

    const renderGame = () => {
        if (page === 1) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center bg-[url('/game-title-bg.png')] text-blue-dark">
                    <div>
                        <h3>Adam & Brenda</h3>
                        <p className="game-text snell-font mb-4 border-y border-black w-full text-center">The Wedding Campaign</p>
                    </div>
                    <Button size="small" onClick={handleOpenTutorial}>
                        Start Game
                    </Button>
                </div>
            );
        }
        
        return (
            <>
                { renderOverlay() }
                <div id="score" className="p-2 text-right flex justify-end font-semibold text-primary-dark">
                    <p>HI { highScore }</p>
                    <p className="ml-2">{ score }</p>
                </div>
                <Image
                    className={`absolute top-0 h-auto right-[-50%] w-[100px] animate-loopRightToLeftSlow ${gameStart ? 'unpause-animate' : 'pause-animate'}`}
                    src="/cloud-1.png"
                    alt="cloud BG"
                    width={100}
                    height={100}
                />
                <Image
                    className={`absolute top-2 h-auto right-[-50%] w-[120px] animate-loopRightToLeftSlower ${gameStart ? 'unpause-animate' : 'pause-animate'}`}
                    src="/cloud-2.png"
                    alt="cloud BG"
                    width={120}
                    height={120}
                />
                <Image
                    className={`absolute top-0 h-auto right-[-50%] w-[120px] animate-loopRightToLeft ${gameStart ? 'unpause-animate' : 'pause-animate'}`}
                    src="/cloud-2.png"
                    alt="cloud BG"
                    width={120}
                    height={120}
                />
                <Image
                    className={`absolute top-1 h-auto right-[-50%] w-[100px] animate-loopRightToLeft ${gameStart ? 'unpause-animate' : 'pause-animate'}`}
                    src="/cloud-3.png"
                    alt="cloud BG"
                    width={100}
                    height={100}
                />
                <div id="background" className={`absolute bottom-0 bg-[url('/background.png')] bg-auto bg-repeat-x h-full w-full bg-bottom animate-loopBackground ${gameStart ? 'unpause-animate' : 'pause-animate'}`} />
                <div id="midground" className={`absolute bottom-0 bg-[url('/midground.png')] bg-auto bg-repeat-x h-full w-full bg-bottom animate-loopMidground ${gameStart ? 'unpause-animate' : 'pause-animate'}`} />
                <div id="foreground" className={`absolute bottom-0 bg-[url('/foreground.png')] bg-auto bg-repeat-x h-full w-full bg-bottom animate-loopForeground ${gameStart ? 'unpause-animate' : 'pause-animate'}`} />
                <div id="couple" ref={coupleSpritesRef} className="absolute bottom-0 left-2 flex">
                    { renderCoupleSprite() }
                </div>
            </>
        )
    };

    const renderScenes = () => {
        if (isLoading) {
            return (
                <div className="relative w-full max-w-[600px] h-[200px] border bg-white border-black mx-auto overflow-hidden mt-4 flex items-center justify-center bg-gradient-to-b from-blue-sky from-30% to-blue-pastel">
                    <p>Please wait a moment...</p>
                </div>
            );
        }

        if (!isOnDesktop) {
            return (
                <div className="text-white w-full flex flex-col justify-center items-center text-center p-4">
                    <h3>Oops! Apologies hero, this content is available only on desktop</h3>
                </div>
            );
        }

        return (
            <div
                id="gameContainer"
                className="relative w-full min-w-[300px] max-w-[600px] h-[200px] border border-black mx-auto overflow-hidden mt-4 bg-gradient-to-b from-blue-sky from-30% to-blue-pastel">
                { renderGame() }
            </div>
        );
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
    
    return (
        <div className="bg-blue-dark h-screen w-screen overflow-hidden relative">
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

            <div className="text-center flex flex-col items-center justify-center w-full mt-20 text-white">
                <div className="max-w-[550px]">
                    <h1 className="header">Game</h1>
                    {
                        isOnDesktop && (
                            <p>&quot;No matter what challenges we face along our journey, we can get through it together.&quot;</p>
                        )
                    }
                </div>
            </div>
            { renderScenes() }
            <LicenseFooter />
            <SideBarMobile open={openSideBar} items={getWebNavigations()} onClose={() => { setOpenSideBar(false) }} />
        </div>
    );
}