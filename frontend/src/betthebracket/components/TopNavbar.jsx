import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/LOGO.png'

export default function TopNavbar(props) {

    const navigate = useNavigate();

    const navLinkStyle = {
        color: 'white',
        marginRight: 'var(--spacing-medium)',
        textDecoration: 'none'
      };

    //remove token from local storage and redirect to home page
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate(''); 
    };


    return <Navbar className="navbar" sticky="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand as={Link} to="/home">
                <img
                    alt="BetTheBracket Logo"
                    src={logo}
                    width="100rem"
                    height="100rem"
                   className="d-inline-block align-top"
                />{' '}
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="home" style={navLinkStyle}>Home</Nav.Link>
                    <Nav.Link as={Link} to="games" style={navLinkStyle}>Games</Nav.Link>
                    <Nav.Link as={Link} to="nbagames" style={navLinkStyle}>NBA Games</Nav.Link>
                    <Nav.Link as={Link} to="profile" style={navLinkStyle}>Profile</Nav.Link>
                    <Nav.Link onClick={handleLogout} style={navLinkStyle}>Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}