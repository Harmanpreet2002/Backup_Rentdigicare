import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={12}>{new Date().getFullYear()} © Rentdigicare</Col>
            
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
