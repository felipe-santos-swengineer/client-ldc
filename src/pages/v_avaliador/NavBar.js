import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Avatar from '@material-ui/core/Avatar';
import Container from 'react-bootstrap/Container';
import Portas from "../../portas";

//auth
import StoreContext from '../../components/Store/Context';
import { useContext } from 'react';

export default function NavBar() {
  //auth 
  const { setToken } = useContext(StoreContext);
  const { token } = useContext(StoreContext);

  if (token) {
    const redirect = async () => {
      try {
        const response = await fetch(Portas().serverHost + "/verify/" + token,
          {
            method: "GET",
          }
        );

        const resJSON = await response.json();

        if (resJSON === "aluno") {
          window.location = "/alunoHome"
          return;
        }
        if (resJSON === "avaliador") {
          return;
        }
        if (resJSON === "admin") {
          window.location = "/adminHome";
          return;
        }
        else {
          setToken(null)
        }

      } catch (err) {
      }
    }
    redirect();
  }
  else {
    window.location = "/";
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ marginBottom: "20px" }}>
        <Container>
          <Avatar alt="Icone do sistema" src="plc_logo.ico" style={{ marginRight: "10px" }}></Avatar>
          <Navbar.Brand href="/avaliadorHome">CHRONOS-UFC</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link href="/avaliadorPerfil" >Perfil</Nav.Link>
              <NavDropdown title="Controle de Atividades" id="basic-nav-dropdown">
                <NavDropdown.Item href="/avaliarAtividades">Avaliar Atividades</NavDropdown.Item>
                <NavDropdown.Item href="/historicoAvaliacoes">Histórico de Avaliações</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Opções" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setToken(null)}>Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div >
  )
}