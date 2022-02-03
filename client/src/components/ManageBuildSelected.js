import React from 'react'
import Moment from 'react-moment'
import { Button } from 'react-bootstrap'
import noImage from '../img/noImage.png'

const ManageBuildSelected = props => {
    return <div className="pt-3">
        <div className="d-flex mb-1">
            <div id="img-container" className="img-managebuildscreen me-3">
                <img src={props.component.image ? `${process.env.REACT_APP_API_URL}/static/${props.component.image}` : noImage} alt={props.component.type}/>
            </div>

            {props.remove && <div className="d-flex align-items-center">
                <Button onClick={() => props.remove(props.component.type)} variant="outline-dark">Usuń</Button>
            </div>}
        </div>

        <div className="text-break mb-1">
            {props.component.name}
        </div>

        <div id="component-fittings" className="d-flex flex-column justify-content-center mb-2">
            {props.component.type!=='mobo' && props.component.caseCompatibility && 
            <small>Zgodn. z typem obudowy: <b>{props.component.caseCompatibility==='matx' ? 'mATX' : props.component.caseCompatibility.toUpperCase()}</b></small>}
            {props.component.type==='mobo' && props.component.caseCompatibility && 
            <small>Zgodn. z typem obudowy: <b>{props.component.caseCompatibility==='matx' ? 'mATX i większe' : props.component.caseCompatibility.toUpperCase() + ' i większe'}</b></small>}
            {props.component.cpuCompatibility && <small>Zgodn. z socketem procesora: <b>{props.component.cpuCompatibility.toUpperCase()}</b></small>}
            {props.component.ramCompatibility && <small>Zgodn. z typem pamięci RAM: <b>{props.component.ramCompatibility.toUpperCase()}</b></small>}
        </div>

        <small className="d-flex text-muted fst-italic">
            <div className="me-1">Dodano:</div>
            <div>
                <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.component.addedTime}</Moment>
            </div>
        </small>
        <small className="d-flex">
            <div className="me-1">Dodano przez:</div>
            <a href={`/profile/${props.component.addedBy}`}>{props.component.nick}</a>
        </small>
    </div>
}

export default ManageBuildSelected
