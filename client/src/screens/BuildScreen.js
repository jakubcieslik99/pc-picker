import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import { detailsConfigAction, detailsConfigSuccessReset } from '../actions/configActions'
import { Container } from 'react-bootstrap'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import BuildComponent from '../components/BuildComponent'

const BuildScreen = () => {
    const {loading, success, config, error} = useSelector(state => state.detailsConfig)

    const dispatch = useDispatch()
    const {id} = useParams()

    useEffect(() => {
        if(config && success) dispatch(detailsConfigSuccessReset())
        else dispatch(detailsConfigAction(id))

        return () => {}
    }, [config, dispatch, id]) // eslint-disable-line react-hooks/exhaustive-deps

    return <Container id="screen" className="">
        {error ? <div className="pt-3 pb-1 text-center error-message">{error}</div> : 
        loading ?  <div className="pt-3 pb-1 text-center">Ładowanie...</div> : 
        config && <>
            <div className="pt-2 d-flex justify-content-center align-items-center fs-4">
                <div className="pe-5 fs-5">Nr zestawu: <b>{config.id}</b></div>
                <div className="d-flex align-items-center text-danger build-card-like">
                    {Math.floor(Math.random()*2)===0 ? <FaRegHeart/> : <FaHeart/>}
                    <b className="ms-2 fs-5">{Math.round(Math.random() * (100 - 0) + 0)}</b>
                </div>
            </div>

            <div className="pt-2 pb-3 d-flex flex-column flex-sm-row justify-content-center align-items-center border-bottom border-secondary">
                <div className="pe-sm-4 d-flex text-muted fst-italic">
                    <div className="me-1">Dodano:</div>
                    <div>
                        <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{config.composedTime}</Moment>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="me-1">Stworzono przez:</div>
                    <Link to={`/profile/${config.composedBy}`} target="_blank">{config.nick}</Link>
                </div>
            </div>

            {config.case && <BuildComponent component={config.case}/>}
            {config.cpu && <BuildComponent component={config.cpu}/>}
            {config.mobo && <BuildComponent component={config.mobo}/>}
            {config.ram && <BuildComponent component={config.ram}/>}
            {config.gpu && <BuildComponent component={config.gpu}/>}
            {config.psu && <BuildComponent component={config.psu}/>}
            {config.driveOne && <BuildComponent component={config.driveOne}/>}
            {config.driveTwo && <BuildComponent component={config.driveTwo}/>}
            {config.driveThree && <BuildComponent component={config.driveThree}/>}
            {config.driveFour && <BuildComponent component={config.driveFour}/>}
        </>}
    </Container>
}

export default BuildScreen
