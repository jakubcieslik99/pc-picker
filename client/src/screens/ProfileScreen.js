import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { listUserProfileAction, updateUserAction, updateUserReset, logoutUserAction, fetchUserAction, listUserMessageErrorReset } from '../actions/userActions'
import { deleteManagedComponentAction, deleteManagedComponentReset } from '../actions/componentActions'
import { deleteManagedConfigAction, deleteManagedConfigReset } from '../actions/configActions'
import { Container, Form, Button, Modal } from 'react-bootstrap'
import { FaLaptopMedical, FaUserCircle, FaEnvelope, FaKey } from 'react-icons/fa'
import { BsCpuFill} from 'react-icons/bs'
import ProfileComponent from '../components/ProfileComponent'
import ProfileBuild from '../components/ProfileBuild'

const ProfileScreen = () => {
    const {loading: loading_listUser, message: message_listUser, userInfo, error: error_listUser} = useSelector(state => state.listUser)
    const {loading: loading_listUserData, nick: nick_listUserProfile, isAdmin, components, configs, error: error_listUserData} = useSelector(state => state.listUserProfile)
    const {loading: loading_deleteManagedComponent, message: message_deleteManagedComponent, error: error_deleteManagedComponent} = useSelector(state => state.deleteManagedComponent)
    const {loading: loading_deleteManagedConfig, message: message_deleteManagedConfig, error: error_deleteManagedConfig} = useSelector(state => state.deleteManagedConfig)

    const [accontSettingsModal, setAccountSettingsModal] = useState(false)
    const [email, setEmail] = useState('')
    const [nick, setNick] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newRepassword, setNewRepassword] = useState('')

    const dispatch = useDispatch()
    const {id} = useParams()
    const {register, setValue, handleSubmit, watch, errors} = useForm()
    const matchPassword = useRef()
    matchPassword.current = watch('newPassword', '')

    useEffect(() => {
        if(error_listUser) dispatch(listUserMessageErrorReset())
        if(error_deleteManagedComponent) dispatch(deleteManagedComponentReset())
        if(error_deleteManagedConfig) dispatch(deleteManagedConfigReset())

        if(message_listUser) setTimeout(() => {
            setAccountSettingsModal(false)
            dispatch(updateUserReset())
        }, 3000)
        else if(message_deleteManagedComponent) setTimeout(() => dispatch(deleteManagedComponentReset()), 1000)
        else if(message_deleteManagedConfig) setTimeout(() => dispatch(deleteManagedConfigReset()), 1000)
        else {
            dispatch(listUserProfileAction(id))

            if(userInfo) {
                dispatch(fetchUserAction())

                setEmail(userInfo.email ? userInfo.email : '')
                setNick(userInfo.nick ? userInfo.nick : '')
            }
        }

        return () => {}
    }, [message_listUser, message_deleteManagedComponent, message_deleteManagedConfig, dispatch, userInfo, id]) // eslint-disable-line react-hooks/exhaustive-deps

    const deleteManagedComponentHandler = (componentId) => {
        dispatch(deleteManagedComponentAction(componentId))
    }

    const deleteManagedConfigHandler = (configId) => {
        dispatch(deleteManagedConfigAction(configId))
    }

    const showAccountSettingsModal = () => {
        setValue('email', email)
        setValue('nick', nick)
    }
    const hideAccountSettingsModal = () => {
        setAccountSettingsModal(false)
        setEmail(userInfo.email ? userInfo.email : '')
        setNick(userInfo.nick ? userInfo.nick : '')
    }

    const submitHandler = () => {
        dispatch(updateUserAction({
            id: userInfo.id,
            email: email,
            nick: nick,
            password: password,
            newpassword: newPassword,
            newrepassword: newRepassword
        }))
        setValue('password', '')
        setValue('newPassword', '')
        setValue('newRepassword', '')
        setPassword('')
        setNewPassword('')
        setNewRepassword('')
    }

    return <Container id="screen" className="">
        {error_listUserData ? <div className="pt-3 pb-1 text-center error-message">{error_listUserData}</div> : 
        loading_listUserData ?  <div className="pt-3 pb-1 text-center">Ładowanie...</div> : 
        nick_listUserProfile && <>
            <div className="pt-2 pb-3 d-flex flex-column flex-md-row justify-content-center align-items-center border-bottom border-secondary">
                <div className="pb-3 pb-md-0 pe-md-3">
                    <div className="d-flex align-items-center fs-5">
                        <FaUserCircle/>
                        <div className="ms-2">{nick_listUserProfile}</div>
                        {isAdmin ? <FaKey className="ms-1"/> : null}
                    </div>
                    {userInfo && userInfo.id===Number.parseInt(id) && <div className="d-flex align-items-center fs-5">
                        <FaEnvelope/>
                        <div className="ms-2">{userInfo.email}</div>
                    </div>}
                </div>

                {userInfo && userInfo.id===Number.parseInt(id) && <div className="d-flex ps-md-3">
                    <div className="me-3">
                        <Button onClick={() => setAccountSettingsModal(true)} variant="dark">Ustawienia konta</Button>

                        <Modal show={accontSettingsModal} onShow={() => showAccountSettingsModal()} onHide={() => hideAccountSettingsModal()}>
                            <Form onSubmit={handleSubmit(submitHandler)} className="p-5 border border-1 border-dark rounded-3 bg-lightgray">
                                <Modal.Header closeButton>
                                    <Modal.Title>Ustawienia konta:</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    {error_listUser && error_listUser==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                                    error_listUser ? <div className="error-message">{error_listUser}</div> : 
                                    loading_listUser ? <div>Ładowanie...</div> : 
                                    message_listUser && <div>{message_listUser}</div>}

                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Adres email*</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="email" 
                                            placeholder="Podaj nowy email" 
                                            isInvalid={errors.email ? true : false} 
                                            onChange={e => setEmail(e.target.value)} 
                                            ref={register({
                                                required: true,
                                                maxLength: 64,
                                                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                                            })}
                                        />
                                        {errors.email && errors.email.type==='required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                                        {errors.email && errors.emaii.type==='maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 64.</Form.Control.Feedback>}
                                        {errors.email && errors.email.type==='pattern' && <Form.Control.Feedback type="invalid">Niepoprawny format adresu e-mail.</Form.Control.Feedback>}
                                        <Form.Text className="text-muted">
                                            Nigdy nie udostępniamy nikomu Twojego adresu email.
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="nick">
                                        <Form.Label>Nick*</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="nick" 
                                            placeholder="Podaj nowy nick" 
                                            isInvalid={errors.nick ? true : false}
                                            onChange={e => setNick(e.target.value)} 
                                            ref={register({
                                                required: true,
                                                maxLength: 32,
                                                pattern: /^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšśžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_-]+$/g
                                            })}
                                        />
                                        {errors.nick && errors.nick.type==='required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                                        {errors.nick && errors.nick.type==='maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 32.</Form.Control.Feedback>}
                                        {errors.nick && errors.nick.type==='pattern' && <Form.Control.Feedback type="invalid">Niepoprawny format nicku.</Form.Control.Feedback>}
                                        <Form.Text className="text-muted">
                                            Twoja unikatowa nazwa w serwisie.
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-5" controlId="password">
                                        <Form.Label>Aktualne hasło*</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            name="password" 
                                            placeholder="Podaj hasło" 
                                            isInvalid={errors.password ? true : false}
                                            onChange={e => setPassword(e.target.value)} 
                                            ref={register({
                                                required: true,
                                                minLength: 8,
                                                maxLength: 64
                                            })}
                                        />
                                        {errors.password && errors.password.type==='required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                                        {errors.password && errors.password.type==='minLength' && <Form.Control.Feedback type="invalid">Minimalna długość wynosi 8.</Form.Control.Feedback>}
                                        {errors.password && errors.password.type==='maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 64.</Form.Control.Feedback>}
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="newPassword">
                                        <Form.Label>Nowe hasło</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            name="newPassword" 
                                            placeholder="Podaj nowe hasło" 
                                            isInvalid={errors.newPassword ? true : false}
                                            onChange={e => setNewPassword(e.target.value)} 
                                            ref={register({
                                                minLength: 8,
                                                maxLength: 64
                                            })}
                                        />
                                        {errors.newPassword && errors.newPassword.type==='minLength' && <Form.Control.Feedback type="invalid">Minimalna długość wynosi 8.</Form.Control.Feedback>}
                                        {errors.newPassword && errors.newPassword.type==='maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 64.</Form.Control.Feedback>}
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="newRepassword">
                                        <Form.Label>Powtórz nowe hasło</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            name="newRepassword" 
                                            placeholder="Podaj nowe hasło ponownie" 
                                            isInvalid={errors.newRepassword ? true : false}
                                            onChange={e => setNewRepassword(e.target.value)} 
                                            ref={register({
                                                validate: value => value===matchPassword.current
                                            })}
                                        />
                                        {errors.newRepassword && <Form.Control.Feedback type="invalid">Hasła nie są identyczne.</Form.Control.Feedback>}
                                    </Form.Group>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="dark" type="submit">Zapisz</Button>
                                    <Button variant="secondary" onClick={() => hideAccountSettingsModal()}>Zamknij</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </div>}
            </div>

            <div className="row mt-4 mb-3">
                <div className="col-md-6">
                    <div className="mb-4 mb-md-0 pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        {error_deleteManagedComponent ? <div className="pb-1 text-center error-message">{error_deleteManagedComponent}</div> : 
                        loading_deleteManagedComponent ? <div className="pb-1 text-center">Usuwanie komponentu...</div> : 
                        message_deleteManagedComponent && <div className="pb-1 text-center">{message_deleteManagedComponent}</div>}

                        <div className="mb-4 d-flex align-items-center">
                            <BsCpuFill className="me-2"/>
                            <h5 className="mb-0">{userInfo && userInfo.id===Number.parseInt(id) ? 'Moje komponenty:' : `Komponenty użytkownika ${nick}:`}</h5>
                        </div>

                        <div className="mb-3">
                            {!components || components.length===0 ? <div className="pt-3 pb-1 text-center">Brak komponentów.</div> : 
                            components.map(component => <ProfileComponent key={component.id} component={component} delete={deleteManagedComponentHandler}/>)}
                        </div>

                        {/*ProfileComponentsPaginator*/}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        {error_deleteManagedConfig ? <div className="pb-1 text-center error-message">{error_deleteManagedConfig}</div> : 
                        loading_deleteManagedConfig ? <div className="pb-1 text-center">Usuwanie konfiguracji...</div> : 
                        message_deleteManagedConfig && <div className="pb-1 text-center">{message_deleteManagedConfig}</div>}

                        <div className="mb-4 d-flex align-items-center">
                            <FaLaptopMedical className="me-2"/>
                            <h5 className="mb-0">{userInfo && userInfo.id===Number.parseInt(id) ? 'Moje konfiguracje:' : `Konfiguracje użytkownika ${nick}:`}</h5>
                        </div>
                        
                        <div className="mb-3">
                            {!configs || configs.length===0 ? <div className="pt-3 pb-1 text-center">Brak konfiguracji.</div> : 
                            configs.map(config => <ProfileBuild key={config.id} config={config} delete={deleteManagedConfigHandler}/>)}
                        </div>

                        {/*ProfileConfigsPaginator*/}
                    </div>
                </div>
            </div>
        </>}
    </Container>
}

export default ProfileScreen
