import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { Button } from 'react-bootstrap'
import noImage from '../img/noImage.png'

const BuildComponent = props => {
    return <div className="row ps-2 ps-sm-0 pt-3 pb-3">
        <div className="d-flex justify-content-sm-end align-items-center col-sm-4 mb-2">
            <div id="img-container" className="img-buildscreen">
                <img src={props.component.image ? `${process.env.REACT_APP_API_URL}/static/${props.component.image}` : noImage} alt={props.component.type}/>
            </div>
        </div>
        <div className="col-sm-8">
            <h3>
                <b>
                    {props.component.type==='case' ? 'Obudowa:' : 
                    props.component.type==='cpu' ? 'Procesor:' : 
                    props.component.type==='mobo' ? 'Płyta główna:' : 
                    props.component.type==='ram' ? 'Pamięć RAM:' : 
                    props.component.type==='gpu' ? 'Karta graficzna:' : 
                    props.component.type==='psu' ? 'Zasilacz:' : 'Dysk:'}
                </b>
            </h3>
            <p>{props.component.name}</p>
            <div className="d-flex align-items-center">
                <Button variant="outline-dark" onClick={() => window.open(props.component.link, '_blank')}>Strona producenta</Button>
            </div>
        </div>

        <div className="d-flex mt-3 mt-md-1 justify-content-sm-end col-sm-4 text-muted fst-italic">
            <div className="me-1">Dodano:</div>
            <div>
                <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.component.addedTime}</Moment>
            </div>
        </div>

        <div className="d-flex mt-sm-3 mt-md-1 col-sm-8">
            <div className="me-1">Dodano przez:</div>
            <Link to={`/profile/${props.component.addedBy}`} target="_blank">{props.component.nick}</Link>
        </div>
    </div>
}

export default BuildComponent
