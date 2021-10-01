import NavBar from "../NavBar";
import Copyright from "../../copyright/Copyright";
import React, { useEffect, useState } from "react";
import Portas from "../../../portas";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Button from '@material-ui/core/Button';


//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';


export default function AvaliarAtividades() {
    const { token } = useContext(StoreContext);
    const [solicitacoes, setSolicitacoes] = useState([]);

    const getSolicitacoes = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/avaliadorSolicitacoes/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            setSolicitacoes(resJSON);

        }
        catch (err) {

        }
    }

    useEffect(() => {
        getSolicitacoes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const dataFormatoBr = (timestamp) => {
        timestamp = timestamp.substring(0, 10);
        timestamp = timestamp[8] + timestamp[9] + "/" + timestamp[5] + timestamp[6] + "/" + timestamp[0] + timestamp[1] + timestamp[2] + timestamp[3];
        return timestamp;
    }


    const avaliar = (id) => {
        console.log(id);
        window.location = "/avaliarAtividadeSelecionada/" + id;
    }

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Id Submissão</th>
                            <th>Aluno</th>
                            <th>Status</th>
                            <th>Data de solicitação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoes.map(solicitacao => (
                            <tr key={solicitacao.id}>
                                <td>{solicitacao.id}</td>
                                <td>{solicitacao.token_aluno}</td>
                                <td>{solicitacao.status}</td>
                                <td>{dataFormatoBr(solicitacao.data_criacao)}</td>
                                <td>
                                    {solicitacao.status === "Pendente" &&
                                        <Button variant="contained" color="primary" onClick={() => avaliar(solicitacao.id)}>
                                            Avaliar
                                        </Button>
                                    }
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