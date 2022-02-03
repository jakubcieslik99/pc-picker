import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { Container, Button } from 'react-bootstrap'
import {logoutUserAction} from '../actions/userActions'
import { listComponentsAction, listComponentsErrorReset } from '../actions/componentActions'
import { detailsConfigAction, /*detailsConfigSuccessReset,*/ detailsConfigReset, saveManagedConfigAction, saveManagedConfigReset } from '../actions/configActions'
import { FaCubes, FaHandPointer, FaCaretLeft, FaCaretRight, FaCube } from 'react-icons/fa'
import { BsCpuFill } from 'react-icons/bs'
import ManageBuildComponent from '../components/ManageBuildComponent'
import ManageBuildSelected from '../components/ManageBuildSelected'
import ManageBuildPaginator from '../components/ManageBuildPaginator'

const ManageBuildScreen = props => {
    const {loading: loading_listComponents, components, parameters, error: error_listComponents} = useSelector(state => state.listComponents)
    const {loading: loading_detailsConfig, /*success,*/ config: config_detailsConfig, error: error_detailsConfig} = useSelector(state => state.detailsConfig)
    const {loading: loading_saveManagedConfig, message, config: config_saveManagedConfig, error: error_saveManagedConfig} = useSelector(state => state.saveManagedConfig)

    const [id, setId] = useState('')
    const [caseComponent, setCaseComponent] = useState(null)
    const [cpuComponent, setCpuComponent] = useState(null)
    const [moboComponent, setMoboComponent] = useState(null)
    const [ramComponent, setRamComponent] = useState(null)
    const [gpuComponent, setGpuComponent] = useState(null)
    const [psuComponent, setPsuComponent] = useState(null)
    const [driveOneComponent, setDriveOneComponent] = useState(null)
    const [driveTwoComponent, setDriveTwoComponent] = useState(null)
    const [driveThreeComponent, setDriveThreeComponent] = useState(null)
    const [driveFourComponent, setDriveFourComponent] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error_listComponents) dispatch(listComponentsErrorReset())
        if(error_detailsConfig) dispatch(detailsConfigReset())
        if(error_saveManagedConfig) dispatch(saveManagedConfigReset())

        if(message && config_saveManagedConfig) {
            history.push(`/build/${config_saveManagedConfig.id}`)
            dispatch(saveManagedConfigReset())
        }

        let data = {
            searchKeyword: '',
            page: 1
        }
        if(params.searchKeyword && params.searchKeyword!=='undefined') data.searchKeyword = params.searchKeyword
        if(params.page && params.page!=='undefined') data.page = parseInt(params.page)

        if(config_detailsConfig && params.id) {
            !id && setId(config_detailsConfig.id)
            config_detailsConfig.case && !caseComponent && setCaseComponent(config_detailsConfig.case)
            config_detailsConfig.cpu && !cpuComponent && setCpuComponent(config_detailsConfig.cpu)
            config_detailsConfig.mobo && !moboComponent && setMoboComponent(config_detailsConfig.mobo)
            config_detailsConfig.ram && !ramComponent && setRamComponent(config_detailsConfig.ram)
            config_detailsConfig.gpu && !gpuComponent && setGpuComponent(config_detailsConfig.gpu)
            config_detailsConfig.psu && !psuComponent && setPsuComponent(config_detailsConfig.psu)
            config_detailsConfig.driveOne && !driveOneComponent && setDriveOneComponent(config_detailsConfig.driveOne)
            config_detailsConfig.driveTwo && !driveTwoComponent && setDriveTwoComponent(config_detailsConfig.driveTwo)
            config_detailsConfig.driveThree && !driveThreeComponent && setDriveThreeComponent(config_detailsConfig.driveThree)
            config_detailsConfig.driveFour && !driveFourComponent && setDriveFourComponent(config_detailsConfig.driveFour)

            if(!params.step || (params.step!=='1' && params.step!=='2' && params.step!=='3' && params.step!=='4' && params.step!=='5' && params.step!=='6' && params.step!=='7' && params.step!=='8')) 
                history.push(`/manage-build?id=${config_detailsConfig.id}&step=8`)
            else if(params.step==='1' || params.step==='2' || params.step==='3' || params.step==='4' || params.step==='5' || params.step==='6' || params.step==='7')
                dispatch(listComponentsAction(params.step, data.searchKeyword, data.page))
        }
        else if(!config_detailsConfig && params.id) {
            dispatch(detailsConfigAction(params.id))
        }
        else if(config_detailsConfig && !params.id && !params.step) {
            setId('')
            setCaseComponent(null)
            setCpuComponent(null)
            setMoboComponent(null)
            setRamComponent(null)
            setGpuComponent(null)
            setPsuComponent(null)
            setDriveOneComponent(null)
            setDriveTwoComponent(null)
            setDriveThreeComponent(null)
            setDriveFourComponent(null)

            history.push(`/manage-build?step=1`)
        }
        else {
            if(config_detailsConfig && !params.id) {
                setId('')
                setCaseComponent(null)
                setCpuComponent(null)
                setMoboComponent(null)
                setRamComponent(null)
                setGpuComponent(null)
                setPsuComponent(null)
                setDriveOneComponent(null)
                setDriveTwoComponent(null)
                setDriveThreeComponent(null)
                setDriveFourComponent(null)
            }

            if(params.step==='1') {
                dispatch(listComponentsAction(params.step, data.searchKeyword, data.page))
            } 
            else if(params.step==='2' || params.step==='3' || params.step==='4' || params.step==='5' || params.step==='6' || params.step==='7') 
                !caseComponent ? history.push(`/manage-build?step=1`) : dispatch(listComponentsAction(params.step, data.searchKeyword, data.page))
            else if(params.step==='8') 
                !caseComponent && history.push(`/manage-build?step=1`)
            else 
                history.push(`/manage-build?step=8`)
        }
        
        return () => {}
    }, [message, config_detailsConfig, dispatch, params.step, params.searchKeyword, params.page]) // eslint-disable-line react-hooks/exhaustive-deps

    const searchHandler = event => {
        event.preventDefault()
        history.push(`/manage-build?${params.id ? 'id=' + params.id + '&' : ''}step=${params.step}&searchKeyword=${searchKeyword}`)
    }
    const searchHandlerEnter = event => {
        event.key==='Enter' && history.push(`/manage-build?${params.id ? 'id=' + params.id + '&' : ''}step=${params.step}&searchKeyword=${searchKeyword}`)
    }

    const clearSearchHandler = event => {
        event.preventDefault()
        setSearchKeyword('')
        history.push(`/manage-build?${params.id ? 'id=' + params.id + '&' : ''}step=${params.step}&searchKeyword=`)
    }

    const submitHandler = () => {
        dispatch(saveManagedConfigAction({
            id: id,
            caseId: caseComponent ? caseComponent.id : null,
            cpuId: cpuComponent ? cpuComponent.id : null,
            moboId: moboComponent ? moboComponent.id : null,
            ramId: ramComponent ? ramComponent.id : null,
            gpuId: gpuComponent ? gpuComponent.id : null,
            psuId: psuComponent ? psuComponent.id : null,
            driveOneId: driveOneComponent ? driveOneComponent.id : null,
            driveTwoId: driveTwoComponent ? driveTwoComponent.id : null,
            driveThreeId: driveThreeComponent ? driveThreeComponent.id : null,
            driveFourId: driveFourComponent ? driveFourComponent.id : null
        }))


    }

    const setComponentHandler = component => {
        component.type==='case' ? setCaseComponent(component) : 
        component.type==='cpu' ? setCpuComponent(component) : 
        component.type==='mobo' ? setMoboComponent(component) : 
        component.type==='ram' ? setRamComponent(component) : 
        component.type==='gpu' ? setGpuComponent(component) : 
        component.type==='psu' ? setPsuComponent(component) : 
        component.type==='driveOne' ? setDriveOneComponent(component) : 
        component.type==='driveTwo' ? setDriveTwoComponent(component) : 
        component.type==='driveThree' ? setDriveThreeComponent(component) : 
        setDriveFourComponent(component)
    }

    const removeComponentHandler = componentType => {
        componentType==='case' ? setCaseComponent(null) : 
        componentType==='cpu' ? setCpuComponent(null) : 
        componentType==='mobo' ? setMoboComponent(null) : 
        componentType==='ram' ? setRamComponent(null) : 
        componentType==='gpu' ? setGpuComponent(null) : 
        componentType==='psu' ? setPsuComponent(null) : 
        componentType==='driveOne' ? setDriveOneComponent(null) : 
        componentType==='driveTwo' ? setDriveTwoComponent(null) : 
        componentType==='driveThree' ? setDriveThreeComponent(null) : 
        setDriveFourComponent(null)
    }

    const renderSelectedComponentHandler = () => {
        if(params.step==='1' && caseComponent) return <ManageBuildSelected component={caseComponent} remove={removeComponentHandler}/>
        else if(params.step==='2' && cpuComponent) return <ManageBuildSelected component={cpuComponent} remove={removeComponentHandler}/>
        else if(params.step==='3' && moboComponent) return <ManageBuildSelected component={moboComponent} remove={removeComponentHandler}/>
        else if(params.step==='4' && ramComponent) return <ManageBuildSelected component={ramComponent} remove={removeComponentHandler}/>
        else if(params.step==='5' && gpuComponent) return <ManageBuildSelected component={gpuComponent} remove={removeComponentHandler}/>
        else if(params.step==='6' && psuComponent) return <ManageBuildSelected component={psuComponent} remove={removeComponentHandler}/>
        else if(params.step==='7') {
            if(driveOneComponent) return <ManageBuildSelected component={driveOneComponent} remove={removeComponentHandler}/>
            if(driveTwoComponent) return <ManageBuildSelected component={driveTwoComponent} remove={removeComponentHandler}/>
            if(driveThreeComponent) return <ManageBuildSelected component={driveThreeComponent} remove={removeComponentHandler}/>
            if(driveFourComponent) return <ManageBuildSelected component={driveFourComponent} remove={removeComponentHandler}/>
        }
        else return <div className="pt-3 pb-3 d-flex justify-content-center align-items-center"><FaCube className="me-1"/> Brak</div>
    }

    return <Container id="screen" className="">
        <div className="pt-2 pb-3 d-flex flex-column flex-md-row justify-content-center align-items-center border-bottom border-secondary">
            <div className="pb-3 pb-md-0 pe-md-3">
                <div className="d-flex align-items-center">
                    <FaCubes/>
                    <div className="ms-2">Krok {params.step ? params.step : '0'}/8</div>
                </div>
                <div className="d-flex align-items-center fs-5">
                    <FaHandPointer/>
                    <div className="ms-2">
                        {params.step==='1' ? 'Wybierz obudowę:' : 
                        params.step==='2' ? 'Wybierz procesor' : 
                        params.step==='3' ? 'Wybierz płytę główną' : 
                        params.step==='4' ? 'Wybierz pamięć RAM' : 
                        params.step==='5' ? 'Wybierz kartę graficzną' : 
                        params.step==='6' ? 'Wybierz zasilacz' : 
                        params.step==='7' ? 'Wybierz dyski' : 
                        params.step==='8' ? 'Podsumowanie' : ''}
                    </div>
                </div>
            </div>

            <div className="d-flex ps-md-3">
                <div className="me-3">
                    <Button disabled={!params.step || params.step==='1'} onClick={() => history.push(`/manage-build?${params.id ? 'id=' + params.id + '&' : ''}step=${parseInt(params.step) - 1}`)} variant="outline-dark" className="d-flex align-items-center ps-1">
                        <FaCaretLeft className="fs-5 me-1"/>
                        Wstecz
                    </Button>
                </div>
                <div>
                    <Button disabled={!caseComponent} onClick={() => params.step && params.step==='8' ? submitHandler() : history.push(`/manage-build?${params.id ? 'id=' + params.id + '&' : ''}step=${parseInt(params.step) + 1}`)} variant="dark" className="d-flex align-items-center pe-1">
                        {params.step && params.step==='8' ? 'Dodaj' : 'Dalej'}
                        <FaCaretRight className="fs-5 ms-1"/>
                    </Button>
                </div>
            </div>
        </div>

        {error_saveManagedConfig && error_saveManagedConfig==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
        error_saveManagedConfig ? <div className="pt-4 text-center error-message">{error_saveManagedConfig}</div> : 
        (loading_saveManagedConfig || loading_detailsConfig) && <div className="pt-4 text-center">Ładowanie...</div>}

        <div className="row mt-4 mb-3">
            {params.step && params.step==='8' ? <>
                {caseComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrana obudowa:</div>
                        <ManageBuildSelected component={caseComponent} remove={null}/>
                    </div>
                </div>}
                {cpuComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany procesor:</div>
                        <ManageBuildSelected component={cpuComponent} remove={null}/>
                    </div>
                </div>}
                {moboComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrana płyta główna:</div>
                        <ManageBuildSelected component={moboComponent} remove={null}/>
                    </div>
                </div>}
                {ramComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrana pamięć RAM:</div>
                        <ManageBuildSelected component={ramComponent} remove={null}/>
                    </div>
                </div>}
                {gpuComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrana karta graficzna:</div>
                        <ManageBuildSelected component={gpuComponent} remove={null}/>
                    </div>
                </div>}
                {psuComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany zasilacz:</div>
                        <ManageBuildSelected component={psuComponent} remove={null}/>
                    </div>
                </div>}
                {driveOneComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany pierwszy dysk:</div>
                        <ManageBuildSelected component={driveOneComponent} remove={null}/>
                    </div>
                </div>}
                {driveTwoComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany drugi dysk:</div>
                        <ManageBuildSelected component={driveTwoComponent} remove={null}/>
                    </div>
                </div>}
                {driveThreeComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany trzeci dysk:</div>
                        <ManageBuildSelected component={driveThreeComponent} remove={null}/>
                    </div>
                </div>}
                {driveFourComponent && <div className="col-md-6 col-lg-4 ps-2 pe-2 pb-3">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">Wybrany czwarty dysk:</div>
                        <ManageBuildSelected component={driveFourComponent} remove={null}/>
                    </div>
                </div>}
            </> : 
            <>
                <div className="col-md-5">
                    <div className="mb-4 pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="input-group pe-2">
                            {searchKeyword && <button onClick={clearSearchHandler} type="button" className="btn btn-dark">X</button>}
                            <input 
                                onKeyDown={!loading_listComponents && searchKeyword ? searchHandlerEnter : null} 
                                value={searchKeyword} name="searchKeyword" type="text" className="form-control" 
                                placeholder={`Wyszukaj ${
                                    params.step==='1' ? 'obudowę' : 
                                    params.step==='2' ? 'procesor' : 
                                    params.step==='3' ? 'płytę główną' : 
                                    params.step==='4' ? 'pamięć RAM' : 
                                    params.step==='5' ? 'kartę graficzną' : 
                                    params.step==='6' ? 'zasilacz' : 
                                    params.step==='7' ? 'dysk' : 'komponent'
                                }`} 
                                onChange={e => setSearchKeyword(e.target.value)}
                            />
                            <button onClick={!loading_listComponents && searchKeyword ? searchHandler : null} type="button" className="btn btn-dark">Szukaj</button>
                        </div>
                    </div>

                    <div className="mb-4 mb-md-0 pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="fs-5">
                            {params.step==='1' ? 'Wybrana obudowa:' : 
                            params.step==='2' ? 'Wybrany procesor:' : 
                            params.step==='3' ? 'Wybrana płyta główna:' : 
                            params.step==='4' ? 'Wybrana pamięć RAM:' : 
                            params.step==='5' ? 'Wybrana karta graficzna:' : 
                            params.step==='6' ? 'Wybrany zasilacz:' : 
                            params.step==='7' ? 'Wybrane dyski (od 1 do 4):' : ''}
                        </div>

                        {renderSelectedComponentHandler()}
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="pt-3 pb-3 ps-3 pe-2 border rounded bg-lightgray">
                        <div className="mb-3 d-flex align-items-center">
                            <BsCpuFill className="me-2"/>
                            <h5 className="mb-0">
                                {params.step==='1' ? 'Obudowy:' : 
                                params.step==='2' ? 'Procesory:' : 
                                params.step==='3' ? 'Płyty główne:' : 
                                params.step==='4' ? 'Pamięci RAM:' : 
                                params.step==='5' ? 'Karty graficzne:' : 
                                params.step==='6' ? 'Zasilacze:' : 
                                params.step==='7' ? 'Dyski:' : ''}
                            </h5>
                        </div>
                        
                        <div className="mb-3">
                            {error_listComponents ? <div className="pt-3 pb-1">{error_listComponents}</div> : 
                            loading_listComponents ? <div className="pt-3 pb-1">Ładowanie...</div> : 
                            !components || components.length===0 ? <div className="pt-3 pb-1 text-center">Brak komponentów.</div> : 
                            components.map(component => <ManageBuildComponent key={component.id} component={component} set={setComponentHandler} selected={
                                component.type==='case' && caseComponent ? true : 
                                component.type==='cpu' && cpuComponent ? true : 
                                component.type==='mobo' && moboComponent ? true : 
                                component.type==='ram' && ramComponent ? true : 
                                component.type==='gpu' && gpuComponent ? true : 
                                component.type==='psu' && psuComponent ? true : 
                                component.type==='drive' && driveFourComponent ? true : false
                            }/>)}
                        </div>

                        <div className="d-flex justify-content-center">
                            {components && components.length>0 && parameters && params.step && <ManageBuildPaginator params={params}/>}
                        </div>
                    </div>
                </div>
            </>}
        </div>
    </Container>
}

export default ManageBuildScreen
