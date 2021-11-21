import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Portas from "../../../portas";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Copyright from "../../../components/copyright/Copyright";

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function ManterAvaliadores() {
    const { token } = useContext(StoreContext);
    const [avaliadores, setAvaliadores] = useState([]);

    const getAvaliadores = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/avaliadores/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            console.log(resJSON)
            setAvaliadores(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAvaliadores();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const desativarAvaliador = async (id, ativo) => {
        if(ativo === false){
            return;
        }
        try {
            const body = { id, token }
            const response = await fetch(Portas().serverHost + "/desativarAvaliador",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            var resJSON = await response.json();
            alert(resJSON)
            window.location = "/manterAvaliadores";

        } catch (err) {
            console.log(err);
            alert("um erro ocorreu!");
        }
    }

    const ativarAvaliador = async (id, ativo) => {
        if(ativo === true){
            return;
        }
        try {
            const body = { id, token }
            const response = await fetch(Portas().serverHost + "/ativarAvaliador",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            var resJSON = await response.json();
            alert(resJSON)
            window.location = "/manterAvaliadores";

        } catch (err) {
            console.log(err);
            alert("um erro ocorreu!");
        }
    }

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Siape</th>
                            <th>Email</th>
                            <th>Ativo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {avaliadores.map(avaliador => (
                            <tr key={avaliador.id}>
                                <td>{avaliador.nome}</td>
                                <td>{avaliador.matricula}</td>
                                <td>{avaliador.email}</td>
                                <td>{avaliador.ativo.toString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => ativarAvaliador(avaliador.id, avaliador.ativo)}
                                    >
                                        Ativar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => desativarAvaliador(avaliador.id, avaliador.ativo)}
                                    >
                                        Suspender
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Paper >
            <Copyright></Copyright>
        </div>
    )
}