import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Container, Form, Button } from 'react-bootstrap'
import { registerUserAction, listUserMessageErrorReset } from '../actions/userActions'

const RegisterScreen = () => {
    const {loading, message, error} = useSelector(state => state.listUser)

    const [email, setEmail] = useState('')
    const [nick, setNick] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [rules, setRules] = useState(false)

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, watch, errors} = useForm()
    const matchPassword = useRef()
    matchPassword.current = watch('password', '')

    useEffect(() => {
        if(error) dispatch(listUserMessageErrorReset())

        return () => {}
    }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = () => {
        dispatch(registerUserAction({
            email: email,
            nick: nick,
            password: password, 
            repassword: repassword,
            rules: rules
        }))
        setValue('password', '')
        setValue('repassword', '')
        setValue('rules', false)
        setPassword('')
        setRepassword('')
        setRules(false)
    }

    return <Container id="screen" className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit(submitHandler)} className="p-5 border border-1 border-dark rounded-3 bg-lightgray">
            <h2 className="mb-4">Rejestracja</h2>

            {error ? <div className="error-message">{error}</div> : 
            loading ? <div className="pb-2">Ładowanie...</div> : 
            message && <div className="pb-2">{message}</div>}

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Adres email</Form.Label>
                <Form.Control 
                    type="text" 
                    name="email" 
                    placeholder="Podaj email" 
                    isInvalid={errors.email ? true : false}
                    onChange={e => setEmail(e.target.value)} 
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

            <Form.Group className="mb-3" controlId="nick">
                <Form.Label>Nick</Form.Label>
                <Form.Control 
                    type="text" 
                    name="nick" 
                    placeholder="Podaj nick" 
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

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Hasło</Form.Label>
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

            <Form.Group className="mb-3" controlId="repassword">
                <Form.Label>Powtórz hasło</Form.Label>
                <Form.Control 
                    type="password" 
                    name="repassword" 
                    placeholder="Podaj hasło ponownie" 
                    isInvalid={errors.repassword ? true : false}
                    onChange={e => setRepassword(e.target.value)} 
                    ref={register({
                        validate: value => value===matchPassword.current
                    })}
                />
                {errors.repassword && <Form.Control.Feedback type="invalid">Hasła nie są identyczne.</Form.Control.Feedback>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="rules">
                <Form.Check 
                    type="checkbox" 
                    name="rules" 
                    label="Potwierdź zapoznanie się z regulaminem" 
                    isInvalid={errors.rules ? true : false}
                    onChange={e => setRules(e.target.checked)} 
                    ref={register({
                        required: true
                    })}
                />
            </Form.Group>

            <Button type="submit" variant="dark" className="mb-3">
                Zarejestruj się
            </Button>

            <div>
                <Link to="/login">Masz już konto? Zaloguj się!</Link>
            </div>
        </Form>
    </Container>
}

export default RegisterScreen
