import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { logoutUserAction } from '../actions/userActions'
import { detailsComponentAction, detailsComponentSuccessReset, detailsComponentReset, saveManagedComponentAction, saveManagedComponentReset } from '../actions/componentActions'
import { Container, Form, Button } from 'react-bootstrap'

const ManageComponentScreen = props => {
    const {loading: loading_detailsComponent, success, component: component_detailsComponent, error: error_detailsComponent} = useSelector(state => state.detailsComponent)
    const {loading: loading_saveManagedComponent, /*progress,*/ message, component: component_saveManagedComponent, error: error_saveManagedComponent} = useSelector(state => state.saveManagedComponent)

    const [id, setId] = useState('')
    const [type, setType] = useState('case')
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [caseCompatibility, setCaseCompatibility] = useState('atx')
    const [cpuCompatibility, setCpuCompatibility] = useState('am4')
    const [ramCompatibility, setRamCompatibility] = useState('ddr4')
    const [fetchedFiles, setFetchedFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])

    const dispatch = useDispatch()
    const history = useHistory()
    const {register, setValue, handleSubmit, errors} = useForm()
    const {getRootProps, getInputProps, open} = useDropzone({
        accept: 'image/jpg, image/jpeg, image/png',
        maxFiles: 1-fetchedFiles.length-selectedFiles.length,
        maxSize: 5*1024*1024,
        noClick: true,
        noKeyboard: true,
        onDrop: acceptedFiles => {
            let preparedFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            setSelectedFiles(selectedFiles.concat(preparedFiles))
        }
    })
    const params = queryString.parse(props.location.search)

    const clearInputsHandler = () => {
        setId('')
        setType('case')
        setName('')
        setLink('')
        setCaseCompatibility('atx')
        setCpuCompatibility('am4')
        setRamCompatibility('ddr4')
        setFetchedFiles([])
        setSelectedFiles([])

        setValue('type', '')
        setValue('name', '')
        setValue('link', '')
        setValue('caseCompatibility', '')
        setValue('cpuCompatibility', '')
        setValue('ramCompatibility', '')
    }

    useEffect(() => {
        if(error_detailsComponent) dispatch(detailsComponentReset())
        if(error_saveManagedComponent) dispatch(saveManagedComponentReset())

        if(message && component_saveManagedComponent) {
            history.push(`/profile/${component_saveManagedComponent.addedBy}`)
            dispatch(saveManagedComponentReset())
        }

        if(success) {
            if(component_detailsComponent) {
                setId(component_detailsComponent.id ? component_detailsComponent.id : '')
                setType(component_detailsComponent.type ? component_detailsComponent.type : 'case')
                setName(component_detailsComponent.name ? component_detailsComponent.name : '')
                setLink(component_detailsComponent.link ? component_detailsComponent.link : '')
                setCaseCompatibility(component_detailsComponent.caseCompatibility ? component_detailsComponent.caseCompatibility : 'atx')
                setCpuCompatibility(component_detailsComponent.cpuCompatibility ? component_detailsComponent.cpuCompatibility : 'am4')
                setRamCompatibility(component_detailsComponent.ramCompatibility ? component_detailsComponent.ramCompatibility : 'ddr4')
                setFetchedFiles(component_detailsComponent.image ? [component_detailsComponent.image] : [])
                setSelectedFiles([])

                setValue('type', component_detailsComponent.type ? component_detailsComponent.type : '')
                setValue('name', component_detailsComponent.name ? component_detailsComponent.name : '')
                setValue('link', component_detailsComponent.link ? component_detailsComponent.link : '')
                setValue('caseCompatibility', component_detailsComponent.caseCompatibility ? component_detailsComponent.caseCompatibility : 'atx')
                setValue('cpuCompatibility', component_detailsComponent.cpuCompatibility ? component_detailsComponent.cpuCompatibility : 'am4')
                setValue('ramCompatibility', component_detailsComponent.ramCompatibility ? component_detailsComponent.ramCompatibility : 'ddr4')
            }
            dispatch(detailsComponentSuccessReset())
        }
        else if(params.id) dispatch(detailsComponentAction(params.id))
        else clearInputsHandler()

        return () => {}
    }, [message, component_detailsComponent, dispatch, setValue, params.id]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = () => {
        dispatch(saveManagedComponentAction({
            id: id,
            type: type,
            name: name,
            link: link,
            caseCompatibility: caseCompatibility,
            cpuCompatibility: cpuCompatibility,
            ramCompatibility: ramCompatibility,
            fetchedFiles: fetchedFiles,
            selectedFiles: selectedFiles
        }))
    }

    const deleteImageHandler = number => {
        fetchedFiles.splice(number, 1)
        setFetchedFiles(() => ([...fetchedFiles]))
    }
    const deleteFileHandler = number => {
        selectedFiles.splice(number, 1)
        setSelectedFiles(() => ([...selectedFiles]))
    }
    const renderFilesHandler = () => {
        let thumbs = []
        for(let i=0; i<1; i++) {
            if(fetchedFiles[i]) {
                thumbs.push(<div className="mb-2" key={'image' + i} data-tip="Kliknij aby usunąć zdjęcie">
                    <div id="thumb-container" className="thumb-img">
                        <img src={`${process.env.REACT_APP_API_URL}/static/${fetchedFiles[i]}`} alt="..." onClick={() => deleteImageHandler(i)}/>
                    </div>
                </div>)
            }
            else {
                for(let j=0; j<1-i; j++) {
                    if(selectedFiles[j]) {
                        thumbs.push(<div className="mb-2" key={'file' + j} data-tip="Kliknij aby usunąć zdjęcie">
                            <div id="thumb-container" className="thumb-img">
                                <img src={selectedFiles[j].preview} alt="..." onClick={() => deleteFileHandler(j)}/>
                            </div>
                        </div>)
                    }
                    else {
                        thumbs.push(<div className="mb-2" key={'choose' + j}>
                            <div id="thumb-container" className="thumb-dropzone" onClick={open}>
                                +
                            </div>
                        </div>)
                    }
                }
                return <>{thumbs}</>
            }
        }
        return <>{thumbs}</>
    }

    return <Container id="screen" className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit(submitHandler)} className="p-5 border border-1 border-dark rounded-3 bg-lightgray">
            <h2 className="mb-4">{params.id ? 'Edycja komponentu' : 'Dodawanie komponentu'}</h2>

            {error_saveManagedComponent && error_saveManagedComponent==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
            error_saveManagedComponent ? <div className="error-message">{error_saveManagedComponent}</div> : 
            (loading_saveManagedComponent || loading_detailsComponent) && <div>Ładowanie...</div>}

            <div className="row justify-content-md-center">
                <div className={(type==='case' || type==='cpu' || type==='mobo' || type==='ram') ? 'col-md-6' : 'col-md-12'}>
                    <Form.Group className="mb-3" controlId="type">
                        <Form.Label>Typ komponentu</Form.Label>
                        <Form.Select
                            name="type"  
                            value={type} 
                            onChange={e => setType(e.target.value)} 
                        >
                            <option value="case">Obudowa</option>
                            <option value="cpu">Procesor</option>
                            <option value="mobo">Płyta główna</option>
                            <option value="ram">Pamięć RAM</option>
                            <option value="gpu">Karta graficzna</option>
                            <option value="drive">Dysk M.2/SSD/HDD</option>
                            <option value="psu">Zasilacz</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Nazwa</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name" 
                            placeholder="Podaj nazwę" 
                            isInvalid={errors.name ? true : false}  
                            onChange={e => setName(e.target.value)} 
                            ref={register({
                                required: true,
                                maxLength: 128
                            })}
                        />
                        {errors.name && errors.name.type === 'required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                        {errors.name && errors.name.type === 'maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 128.</Form.Control.Feedback>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="link">
                        <Form.Label>Link do specyfikacji</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="link" 
                            placeholder="Podaj link do specyfikacji" 
                            isInvalid={errors.link ? true : false} 
                            onChange={e => setLink(e.target.value)} 
                            ref={register({
                                required: true,
                                maxLength: 256,
                                pattern: /^((https?:\/\/)?)[a-zA-Z0-9]{1}[a-zA-Z0-9-.]{0,}\.[a-z]{2,13}[a-zA-Z0-9:/?#[\]@!$%&'()*+,;=\-.]{0,}$/g
                            })}
                        />
                        {errors.link && errors.link.type === 'required' && <Form.Control.Feedback type="invalid">Pole wymagane.</Form.Control.Feedback>}
                        {errors.link && errors.link.type === 'maxLength' && <Form.Control.Feedback type="invalid">Maksymalna długość wynosi 256.</Form.Control.Feedback>}
                        {errors.link && errors.link.type === 'pattern' && <Form.Control.Feedback type="invalid">Niepoprawny format linku.</Form.Control.Feedback>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="files">
                        <Form.Label>Zdjęcie poglądowe</Form.Label>
                        <div {...getRootProps()} className="d-flex flex-row flex-wrap">
                            <input name="files" id="files" {...getInputProps()}/>
                            {renderFilesHandler()}
                        </div>
                        <Form.Text className="text-muted">
                            Maksymalna wielkość zdjęcia (.jpg/.jpeg/.png) to 5 MB.
                        </Form.Text>
                    </Form.Group>
                </div>

                {(type==='case' || type==='cpu' || type==='mobo' || type==='ram') && <div className="col-md-6">
                    {(type==='case' || type==='mobo') && <Form.Group className="mb-3" controlId="caseCompatbility">
                        <Form.Label>Kompatybilność z typem obudowy</Form.Label>
                        <Form.Select 
                            name="caseCompatibility" 
                            value={caseCompatibility} 
                            onChange={e => setCaseCompatibility(e.target.value)}
                        >
                            <option value="atx">ATX</option>
                            <option value="matx">mATX</option>
                            <option value="dtx">DTX</option>
                            <option value="itx">ITX</option>
                        </Form.Select>
                    </Form.Group>}
                    {(type==='cpu' || type==='mobo') && <Form.Group className="mb-3" controlId="cpuCompatibility">
                        <Form.Label>Kompatybilność z socketem procesora</Form.Label>
                        <Form.Select 
                            name="cpuCompatibility" 
                            value={cpuCompatibility} 
                            onChange={e => setCpuCompatibility(e.target.value)}
                        >
                            <option value="am4">AM4</option>
                            <option value="tr4">TR4</option>
                            <option value="fm2+">FM2+</option>
                            <option value="lga2066">LGA2066</option>
                            <option value="lga2011-3">LGA2011-3</option>
                            <option value="lga2011">LGA2011</option>
                        </Form.Select>
                    </Form.Group>}
                    {(type==='cpu' || type==='mobo' || type==='ram') && <Form.Group className="mb-3" controlId="ramCompatibility">
                        <Form.Label>Kompatybilność z typem pamięci RAM</Form.Label>
                        <Form.Select 
                            name="ramCompatibility" 
                            value={ramCompatibility} 
                            onChange={e => setRamCompatibility(e.target.value)}
                        >
                            <option value="ddr5">DDR5</option>
                            <option value="ddr4">DDR4</option>
                            <option value="ddr3">DDR3</option>
                            <option value="ddr2">DDR2</option>
                            <option value="ddr">DDR</option>
                        </Form.Select>
                    </Form.Group>}
                </div>}
            </div>

            <Button variant="primary" type="submit" className="mt-3 btn-dark">
                {params.id ? 'Zapisz komponent' : 'Dodaj komponent'}
            </Button>
        </Form>
    </Container>
}

export default ManageComponentScreen
