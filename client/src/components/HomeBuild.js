import React from 'react'
import { useHistory } from 'react-router-dom'
import Moment from 'react-moment'
import { Card, Button } from 'react-bootstrap'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import noImage from '../img/noImage.png'

const HomeBuild = props => {
    const history = useHistory()

    return <div className="col-sm-6 col-md-4 pt-3 pb-2">
        <Card className="build-card">
            <Card.Header className="p-0 overflow-hidden">
                <div className="d-flex">
                    <div id="img-container">
                        <img src={props.config.cpu && props.config.cpu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.cpu.image}` : noImage} alt="CPU"/>
                    </div>
                    <div id="img-container">
                        <img src={props.config.mobo && props.config.mobo.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.mobo.image}` : noImage} alt="MOBO"/>
                    </div>
                    <div id="img-container">
                        <img src={props.config.ram && props.config.ram.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.ram.image}` : noImage} alt="RAM"/>
                    </div>
                </div>
                <div className="d-flex">
                    <div id="img-container">
                        <img src={props.config.gpu && props.config.gpu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.gpu.image}` : noImage} alt="GPU"/>
                    </div>
                    <div id="img-container">
                        <img src={props.config.psu && props.config.psu.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.psu.image}` : noImage} alt="PSU"/>
                    </div>
                    <div id="img-container">
                        <img src={props.config.case && props.config.case.image ? `${process.env.REACT_APP_API_URL}/static/${props.config.case.image}` : noImage} alt="CASE"/>
                    </div>
                </div>
            </Card.Header>

            <Card.Body>
                <div className="text-truncate"><b>CPU: </b>{props.config.cpu ? props.config.cpu.name : <small className="ms-1 fst-italic">brak</small>}</div>
                <div className="text-truncate"><b>MBO: </b>{props.config.mobo ? props.config.mobo.name : <small className="ms-1 fst-italic">brak</small>}</div>
                <div className="text-truncate"><b>RAM: </b>{props.config.ram ? props.config.ram.name : <small className="ms-1 fst-italic">brak</small>}</div>
                <div className="text-truncate"><b>GPU: </b>{props.config.gpu ? props.config.gpu.name : <small className="ms-1 fst-italic">brak</small>}</div>
                <div className="text-truncate"><b>PSU: </b>{props.config.psu ? props.config.psu.name : <small className="ms-1 fst-italic">brak</small>}</div>

                <small className="text-secondary">#{props.config.id}</small>

                <div className="mt-1 d-flex">
                    <div className="me-1">Autor:</div>
                    <a href={`/profile/${props.config.composedBy}`}>{props.config.nick}</a>
                </div>
                <div className="d-flex text-muted fst-italic">
                    <div className="me-1">Dodano:</div>
                    <div>
                        <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.config.composedTime}</Moment>
                    </div>
                </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between">
                <Button variant="dark" onClick={() => history.push(`/build/${props.config.id}`)}>Szczegóły</Button>
                <div className="d-flex justify-content-center align-items-center text-danger fs-4 build-card-like">
                    {Math.floor(Math.random()*2)===0 ? <FaRegHeart/> : <FaHeart/>}
                    <b className="ms-2 fs-6">{Math.round(Math.random() * (100 - 0) + 0)}</b>
                </div>
            </Card.Footer>
        </Card>
    </div>
}

export default HomeBuild
