import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import queryString from 'query-string'
import { Container, Form, Button } from 'react-bootstrap'
import { loginUserAction, listUserMessageErrorReset, confirmUserAction } from '../actions/userActions'

const LoginScreen = props => {
    const {loading: loading_listUser, message: message_listUser, error: error_listUser} = useSelector(state => state.listUser)
    const {loading: loading_confirmUser, message: message_confirmUser, error: error_confirmUser} = useSelector(state => state.confirmUser)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, errors} = useForm()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error_listUser) dispatch(listUserMessageErrorReset())

        if(params.token) dispatch(confirmUserAction({token: params.token}))

        return () => {}
    }, [dispatch, params.token]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = () => {
        dispatch(loginUserAction({
            email: email,
            password: password
        }))
        setValue('password', '')
        setPassword('')
    }

    return <Container id="screen" className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit(submitHandler)} className="p-5 border border-1 border-dark rounded-3 bg-lightgray">
            <h2 className="mb-4">Logowanie</h2>

            {error_listUser ? <div className="error-message">{error_listUser}</div> : 
            loading_listUser ? <div className="pb-2">{loading_listUser}</div> : 
            message_listUser && <div className="pb-2">{message_listUser}</div>}

            {error_confirmUser ? <div className="error-message">{error_confirmUser}</div> : 
            loading_confirmUser ? <div className="pb-2">{loading_confirmUser}</div> : 
            message_confirmUser && <div className="pb-2">{message_confirmUser}</div>}

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Adres email</Form.Label>
                <Form.Control 
                    type="text" 
                    name="email" 
                    placeholder="Podaj email" 
                    onChange={e => setEmail(e.target.value)} 
                    isInvalid={errors.email ? true : false} 
                    ref={register({
                        required: true,
                        maxLength: 64,
                        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                    })}
                />
                {errors.email && errors.email.type==='required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                {errors.email && errors.email.type==='maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 64.</Form.Control.Feedback>}
                {errors.email && errors.email.type==='pattern' && <Form.Control.Feedback type="invalid">Niepoprawny format adresu e-mail.</Form.Control.Feedback>}
                <Form.Text className="text-muted">
                    Nigdy nie udostępniamy nikomu Twojego adresu email.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Hasło</Form.Label>
                <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="Podaj hasło" 
                    onChange={e => setPassword(e.target.value)} 
                    isInvalid={errors.password ? true : false} 
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

            <Button type="submit" variant="dark" className="mb-3">
                Zaloguj się
            </Button>

            <div>
                <Link to="/register">Nie masz konta? Zarejestruj się!</Link>
            </div>
        </Form>
    </Container>
}

export default LoginScreen
