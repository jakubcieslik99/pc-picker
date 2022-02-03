import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { Navbar, Container, Offcanvas, Nav } from 'react-bootstrap'
import { logoutUserAction } from '../actions/userActions'
import { FaHome, FaLaptopMedical, FaUserCircle, FaDoorOpen } from 'react-icons/fa'
import { BsCpuFill } from 'react-icons/bs'
import { AiOutlineNodeCollapse } from 'react-icons/ai'

const Header = () => {
    const {userInfo} = useSelector(state => state.listUser)

    const dispatch = useDispatch()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if(location.pathname==='/register' && userInfo) history.push('/')
        if(location.pathname==='/login' && userInfo) history.push('/')

        if(location.pathname==='/add' && !userInfo) history.push('/signin')
        
        return () => {}
    }, [location.pathname, userInfo, history])

    const logoutHandler = () => {
        dispatch(logoutUserAction())
        return history.push('/')
    }

    return <Navbar expand="lg" bg="dark" variant="dark" className="py-2 mb-3">
        <Container>
            <Navbar.Brand href="/" className="fs-4">
                <AiOutlineNodeCollapse className="mb-1"/> PC Picker
            </Navbar.Brand>

            <Nav id="desktop-navbar" className="justify-content-end d-none d-lg-flex">
                <Nav.Link onClick={() => history.push('/')} className="d-flex flex-column align-items-center me-1">
                    <FaHome/>
                    <div>Wszystkie konfiguracje</div>
                </Nav.Link>
                <Nav.Link onClick={() => history.push('/manage-component')} className="d-flex flex-column align-items-center me-1">
                    <BsCpuFill/>
                    <div>Dodaj komponent</div>
                </Nav.Link>
                <Nav.Link onClick={() => history.push('/manage-build')} className="d-flex flex-column align-items-center me-1">
                    <FaLaptopMedical/>
                    <div>Stwórz konfigurację</div>
                </Nav.Link>

                {userInfo && <Nav.Link onClick={() => history.push(`/profile/${userInfo.id}`)} className="d-flex flex-column align-items-center">
                    <FaUserCircle/>
                    <div>{userInfo.nick}</div>
                </Nav.Link>}
                {userInfo ? <Nav.Link onClick={logoutHandler} className="d-flex flex-column align-items-center">
                    <FaDoorOpen/>
                    <div>Wyloguj</div>
                </Nav.Link> : 
                <Nav.Link onClick={() => history.push('/login')} className="d-flex flex-column align-items-center">
                    <FaDoorOpen/>
                    <div>Logowanie i rejestracja</div>
                </Nav.Link>}
            </Nav>

            <Navbar.Toggle aria-controls="mobile-navbar"/>
            <Navbar.Offcanvas id="mobile-navbar" aria-labelledby="mobile-navbar" placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link onClick={() => history.push('/')}><FaHome className="mb-1 me-2"/>Wszystkie konfiguracje</Nav.Link>
                        <Nav.Link onClick={() => history.push('/manage-component')}><BsCpuFill className="mb-1 me-2"/>Dodaj komponent</Nav.Link>
                        <Nav.Link onClick={() => history.push('/manage-build')}><FaLaptopMedical className="mb-1 me-2"/>Stwórz konfigurację</Nav.Link>

                        {userInfo && <Nav.Link onClick={() => history.push(`/profile/${'id'}`)}><FaUserCircle className="mb-1 me-2"/>Profil</Nav.Link>}
                        {userInfo ? <Nav.Link onClick={() => history.push('/logout')}><FaDoorOpen className="mb-1 me-2"/>Wyloguj</Nav.Link> : 
                        <Nav.Link onClick={() => history.push('/login')}><FaUserCircle className="mb-1 me-2"/>Logowanie i rejestracja</Nav.Link>}
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
    </Navbar>
}

export default Header
