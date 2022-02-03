import React from 'react'
import Moment from 'react-moment'
import { Button } from 'react-bootstrap'
import noImage from '../img/noImage.png'

const ManageBuildComponent = props => {
    return <div className="mb-4">
        <div className="d-flex mb-1">
            <div id="img-container" className="img-managebuildscreen me-3">
                <img src={props.component.image ? `${process.env.REACT_APP_API_URL}/static/${props.component.image}` : noImage} alt={props.component.type}/>
            </div>

            <div className="d-flex flex-column justify-content-center">
                <Button disabled={props.selected} onClick={() => props.set(props.component)} variant="dark" className="mb-1">Wybierz</Button>

                <div className="d-flex text-muted fst-italic">
                    <div className="me-1">Dodano:</div>
                    <div>
                        <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.component.addedTime}</Moment>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-break mb-1">
            {props.component.name}
        </div>

        <div className="d-flex flex-column">
            {props.component.type!=='mobo' && props.component.caseCompatibility && 
            <small>Zgodn. z typem obudowy: <b>{props.component.caseCompatibility==='matx' ? 'mATX' : props.component.caseCompatibility.toUpperCase()}</b></small>}
            {props.component.cpuCompatibility && <small>Zgodn. z socketem procesora: <b>{props.component.cpuCompatibility.toUpperCase()}</b></small>}
            {props.component.ramCompatibility && <small>Zgodn. z typem pamięci RAM: <b>{props.component.ramCompatibility.toUpperCase()}</b></small>}
        </div>
    </div>
}

export default ManageBuildComponent
