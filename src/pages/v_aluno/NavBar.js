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
          return;
        }
        if (resJSON === "avaliador") {
          window.location = "/avaliadorHome";
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
  else{
    window.location = "/";
  }



  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ marginBottom: "20px" }}>
        <Container>
          <Avatar alt="Icone do sistema" src="plc_logo.ico" style={{ marginRight: "10px" }}></Avatar>
          <Navbar.Brand href="/alunoHome">CHRONOS-UFC</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link href="/alunoPerfil" >Perfil</Nav.Link>
              <NavDropdown title="Atividades" id="basic-nav-dropdown">
                <NavDropdown.Item href="/cadastrarAtividade">Cadastrar atividades</NavDropdown.Item>
                <NavDropdown.Item href="/manterAtividades">Manter atividades</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Avaliação" id="basic-nav-dropdown">
                <NavDropdown.Item href="/solicitarAvaliacao">Solicitar Avaliação</NavDropdown.Item>
                <NavDropdown.Item href="/historicoAvaliacao">Histórico de avaliações</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Opções" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setToken(null)}>Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}