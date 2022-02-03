import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import Moment from 'react-moment'
import { Button } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import noImage from '../img/noImage.png'

const ProfileBuild = props => {
    const {userInfo} = useSelector(state => state.listUser)

    const {id} = useParams()
    const history = useHistory()

    return <div className="mb-4">
        <div className="mb-2">
            <div className="d-flex">
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.cpu && props.config.cpu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.cpu.image}` : noImage} alt="CPU"/>
                </div>
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.mobo && props.config.mobo.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.mobo.image}` : noImage} alt="MOBO"/>
                </div>
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.ram && props.config.ram.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.ram.image}` : noImage} alt="RAM"/>
                </div>
            </div>
            <div className="d-flex">
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.gpu && props.config.gpu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.gpu.image}` : noImage} alt="GPU"/>
                </div>
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.psu && props.config.psu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.psu.image}` : noImage} alt="PSU"/>
                </div>
                <div id="img-container" className="img-profilescreen-second">
                    <img src={props.config.case && props.config.case.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.case.image}` : noImage} alt="CASE"/>
                </div>
            </div>
        </div>

        <div className="d-flex mb-1">
            {userInfo && userInfo.id===Number.parseInt(id) && 
            <Button variant="outline-success" className="me-2" onClick={() => history.push(`/manage-build?id=${props.config.id}`)}>Edytuj</Button>}
            {userInfo && userInfo.id===Number.parseInt(id) && 
            <Button variant="outline-danger" onClick={() => props.delete(props.config.id)}>Usuń</Button>}

            <div className="ms-5 d-flex justify-content-center align-items-center text-danger fs-5">
                {<FaHeart/>}
                <b className="ms-2 fs-6">{Math.round(Math.random() * (100 - 0) + 0)}</b>
            </div>
        </div>

        <div className="text-break mb-1">
            {props.config.cpu && <div className="text-truncate"><b>CPU: </b>{props.config.cpu.name}</div>}
            {props.config.mobo && <div className="text-truncate"><b>MBO: </b>{props.config.mobo.name}</div>}
            {props.config.ram && <div className="text-truncate"><b>RAM: </b>{props.config.ram.name}</div>}
            {props.config.gpu && <div className="text-truncate"><b>GPU: </b>{props.config.gpu.name}</div>}
            {props.config.psu && <div className="text-truncate"><b>PSU: </b>{props.config.psu.name}</div>}

            <div className="mt-1 text-truncate"><b>Case: </b>{props.config.case.name}</div>

            {props.config.driveOne && props.config.driveTwo && props.config.driveThree && props.config.driveFour ? <div className="mt-1 text-truncate"><b>+ Dyski </b>({'4'})</div> : 
            props.config.driveOne && props.config.driveTwo && props.config.driveThree ? <div className="mt-1 text-truncate"><b>+ Dyski </b>({'3'})</div> : 
            props.config.driveOne && props.config.driveTwo ? <div className="mt-1 text-truncate"><b>+ Dyski </b>({'2'})</div> : 
            props.config.driveOne ? <div className="mt-1 text-truncate"><b>+ Dysk </b>({'1'})</div> : null}
        </div>

        <div className="d-flex align-items-center">
            <div className="me-5 d-flex text-muted fst-italic">
                <div className="me-1">Dodano:</div>
                <div>
                    <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.config.composedTime}</Moment>
                </div>
            </div>

            <small className="text-secondary">#{props.config.id}</small>
        </div>
    </div>
}

export default ProfileBuild
