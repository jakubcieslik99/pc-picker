import React from 'react'
import { Container } from 'react-bootstrap'

const Footer = () => {
    return <footer className="mt-4 py-3 bg-dark">
        <Container className="d-flex justify-content-evenly text-white text-center fs-6">
            <div className="px-2">Copyright &copy; PC Picker {new Date().getFullYear()}</div>
            <div className="px-2">Created by Jakub Cieślik</div>
        </Container>
    </footer>
}

export default Footer
