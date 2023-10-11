"use client"
import { io } from "socket.io-client";
import { usePathname, useRouter } from 'next/navigation';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CelebrationIcon from '@mui/icons-material/Celebration';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Person4Icon from '@mui/icons-material/Person4';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogger } from '@/store/actions/fetchUser';
import { baseUrl } from "@/constant/url";
import { swalTopEnd } from "./swal";

function SubCategory({ Icon, title, option, id, active, setActive }) {
    const router = useRouter()
    const pathname = usePathname()
    function handleClick() {
        if (id === active) return setActive(null)
        setActive(id)
    }

    function navigationTo(path) {
        router.push(path)
    }


    return (
        <div className={id === active ? "sub-category-container active" : "sub-category-container"}>
            <div className="sub-category" onClick={handleClick}>
                <Icon />
                {title}
                <ExpandMoreOutlinedIcon />
            </div>
            <ul>
                {option.map((el, i) => {
                    return <li className={pathname === option[i].path ? "active" : null} key={i} onClick={() => navigationTo(option[i].path)}>{pathname === option[i].path ? <CircleIcon /> : <CircleOutlinedIcon />}{el.name}</li>
                })}
            </ul>
        </div>
    )
}

function SubCategory1({ title, alert = 0, handleClick, Icon, path }) {
    const pathname = usePathname()

    return (
        <div className={pathname === path ? "sub-category-container active" : "sub-category-container"}>
            <div className="sub-category" onClick={handleClick}>
                <Icon />
                {title}
                <span>{alert > 0 ? <p>{alert}</p> : null}</span>
            </div>
        </div>
    )
}

export default function Navigation({ children }) {
    const [active, setActive] = useState(null)
    const [isMinimize, setMinimize] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [countNew, setCountNew] = useState(0)
    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState(null);

    const dispatch = useDispatch()
    const logger = useSelector((state) => state.UserReducer.logger)

    useEffect(() => {
        const newSocket = io(baseUrl, { transports: ['websocket'] });
        setSocket(newSocket);

        const handleResize = () => {
            const isMobileDevice = window.innerWidth <= 800; // Set the breakpoint for mobile devices
            setIsMobile(isMobileDevice);
        };

        function notification({ message }) {
            swalTopEnd(message, 10000)
            dispatch(getLogger())
        }

        newSocket.on("notification", notification)

        handleResize();
        dispatch(getLogger())

        window.addEventListener('resize', handleResize);

        return () => {
            newSocket.off("notification", notification)
            newSocket.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);

    useEffect(() => {
        let temp = 0
        if (Array.isArray(logger)) {
            logger.forEach(({ status }) => {
                if (!status) temp++
            })
            setCountNew(temp)
        }
    }, [logger])

    console.log(logger, countNew)

    const router = useRouter()

    function handleNavigate(route) {
        router.push(route)
    }

    function logout() {
        document.cookie = "access_token=; max-age=0; path=/";
        router.push('/login')
    }

    function sideNavClass() {
        let className = ['side-navigation']
        if (isMobile) className.push('mobile')
        if (isMinimize) className.push('minimize')
        return className.join(' ')
    }
    return (
        <div className="navigation-container">

            <div className={sideNavClass()}>
                <h2>ADMIN {(isMobile && !isMinimize) ? <ChevronLeftOutlinedIcon onClick={() => setMinimize(!isMinimize)} /> : null}</h2>
                <div className="category">
                    <h4>Menu</h4>
                    < SubCategory1
                        Icon={NoteAltOutlinedIcon}
                        title={'Absensi'}
                        path={'/absen/history'}
                        handleClick={() => { handleNavigate('/absen/history') }} />
                    < SubCategory1
                        Icon={Person4Icon} s
                        title={'karyawan'}
                        path={'/karyawan'}
                        handleClick={() => { handleNavigate('/karyawan') }} />
                    < SubCategory1
                        Icon={NotificationsActiveOutlinedIcon}
                        title={'Notifikasi'}
                        path={'/notifikasi'}
                        alert={countNew}
                        handleClick={() => { handleNavigate('/notifikasi') }} />
                    < SubCategory1
                        Icon={LogoutOutlinedIcon}
                        title={'Logout'}
                        handleClick={logout} />
                </div>
                <div className="category">
                    <h4>Profile</h4>
                    <div className="profile">
                        <AccountCircleIcon />
                        <div>
                        </div>
                        <MoreHorizOutlinedIcon />
                    </div>
                </div>
            </div>
            {(isMobile && !isMinimize) ? <div className="bg-blur" onClick={() => setMinimize(true)}></div> : null}

            <div className={isMinimize || isMobile ? "container minimize" : "container"}>
                <div className={isMinimize || isMobile ? "top-navigation minimize" : "top-navigation"}>
                    <span
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setMinimize(!isMinimize)}>{isMinimize && !isHovered ? <MenuOutlinedIcon /> : <ChevronLeftOutlinedIcon />}</span>
                    <div className="introduction">
                        <h2>Welcome<CelebrationIcon /></h2>
                        <p>Aplikasi Admin</p>
                    </div>
                    <div className="right-nav">
                        <NotificationsNoneIcon />
                    </div>
                </div>
                <div className="page">
                    {children}
                </div>
            </div>
        </div>
    )
}