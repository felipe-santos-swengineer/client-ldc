import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Portas from "../../../portas";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Copyright from "../../copyright/Copyright";

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function ManterAlunos() {
    const { token } = useContext(StoreContext);
    const [alunos, setAlunos] = useState([]);

    //pegar registros de alunos
    const getAlunos = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            console.log(resJSON)
            setAlunos(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAlunos();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const desativarAluno = async (id, ativo) => {
        if(ativo === false){
            return;
        }
        try {
            const body = { id, token }
            const response = await fetch(Portas().serverHost + "/desativarAluno",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            var resJSON = await response.json();
            alert(resJSON)
            window.location = "/manterAlunos";

        } catch (err) {
            console.log(err);
            alert("um erro ocorreu!");
        }
    }

    const ativarAluno = async (id, ativo) => {
        if(ativo === true){
            return;
        }
        try {
            const body = { id, token }
            const response = await fetch(Portas().serverHost + "/ativarAluno",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            var resJSON = await response.json();
            alert(resJSON)
            window.location = "/manterAlunos";

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
                            <th>Matricula</th>
                            <th>Curso</th>
                            <th>Email</th>
                            <th>Ativo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map(aluno => (
                            <tr key={aluno.id}>
                                <td>{aluno.nome}</td>
                                <td>{aluno.matricula}</td>
                                <td>{aluno.curso}</td>
                                <td>{aluno.email}</td>
                                <td>{aluno.ativo.toString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => ativarAluno(aluno.id, aluno.ativo)}
                                    >
                                        Ativar
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => desativarAluno(aluno.id, aluno.ativo)}
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