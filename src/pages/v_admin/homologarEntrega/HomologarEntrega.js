import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Portas from "../../../portas";
import Copyright from "../../../components/copyright/Copyright";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function HomologarEntrega() {

    const { token } = useContext(StoreContext);
    const [alunos, setAlunos] = useState([]);

    const getAlunos = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();

            var array = [];
            for (var i = 0; i < resJSON.length; i++) {
                if (resJSON[i].status_entrega === "Em Homologação") {
                    array.push(resJSON[i]);
                }
            }
            setAlunos(array);

        } catch (err) {
            alert(err);
        }
    }

    const homologar = async (aluno_token) => {
        try {
            const body = { aluno_token, status: "Atividades entregues" };

            const response = await fetch(Portas().serverHost + "/homologarEntrega/" + token, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON)

        } catch (err) { }
    }

    const indeferir = async (aluno_token) => {
        try {
            const body = { aluno_token, status: "Não Entregue" };

            const response = await fetch(Portas().serverHost + "/homologarEntrega/" + token, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON)

        } catch (err) { }
    }

    const getDetalhes = async (aluno_token) => {
        try {
            const body = { aluno_token };

            const response = await fetch(Portas().serverHost + "/alunoDetalhes/" + token, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON);
            window.location = "/homologarEntrega"

        } catch (err) { }
    }

    useEffect(() => {
        getAlunos();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map(aluno => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.status_entrega}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => getDetalhes(aluno.usertoken)}

                                    >
                                        Detalhes
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: "green", borderColor: "green" }}
                                        onClick={() => homologar(aluno.usertoken)}
                                    >
                                        Homologar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => indeferir(aluno.usertoken)}
                                    >
                                        Indeferir
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Paper>
            <Copyright></Copyright>
        </div>

    )
}
