import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import Moment from 'react-moment'
import { Button } from 'react-bootstrap'
import noImage from '../img/noImage.png'

const ProfileComponent = props => {
    const {userInfo} = useSelector(state => state.listUser)

    const {id} = useParams()
    const history = useHistory()

    return <div className="mb-4">
        <div className="d-flex mb-1">
            <div id="img-container" className="img-profilescreen me-2">
                <img src={props.component.image ? `${process.env.REACT_APP_API_URL}/static/${props.component.image}` : noImage} alt={props.component.type}/>
            </div>

            {userInfo && userInfo.id===Number.parseInt(id) && <div className="d-flex flex-column justify-content-center me-3">
                <Button variant="outline-success" className="mb-1" onClick={() => history.push(`/manage-component?id=${props.component.id}`)}>Edytuj</Button>
                <Button variant="outline-danger" onClick={() => props.delete(props.component.id)}>Usuń</Button>
            </div>}

            <div className="d-flex align-items-end fs-5">
                <b>
                    {props.component.type==='case' ? 'Obudowa' : 
                    props.component.type==='cpu' ? 'Procesor' : 
                    props.component.type==='mobo' ? 'Płyta główna' : 
                    props.component.type==='ram' ? 'Pamięć RAM' : 
                    props.component.type==='gpu' ? 'Karta graficzna' : 
                    props.component.type==='drive' ? 'Dysk' : 
                    props.component.type==='psu' && 'Zasilacz'}:
                </b>
            </div>
        </div>

        <div className="text-break mb-1">
            {props.component.name}
        </div>

        <div className="d-flex flex-column mb-2">
            {props.component.type!=='mobo' && props.component.caseCompatibility && 
            <small>Zgodn. z typem obudowy: <b>{props.component.caseCompatibility==='matx' ? 'mATX' : props.component.caseCompatibility.toUpperCase()}</b></small>}
            {props.component.cpuCompatibility && <small>Zgodn. z socketem procesora: <b>{props.component.cpuCompatibility.toUpperCase()}</b></small>}
            {props.component.ramCompatibility && <small>Zgodn. z typem pamięci RAM: <b>{props.component.ramCompatibility.toUpperCase()}</b></small>}
        </div>

        <div className="d-flex text-muted fst-italic">
            <div className="me-1">Dodano:</div>
            <div>
                <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.component.addedTime}</Moment>
            </div>
        </div>
    </div>
}

export default ProfileComponent
