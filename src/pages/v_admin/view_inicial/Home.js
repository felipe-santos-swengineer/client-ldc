import NavBar from "../NavBar";
import Copyright from "../../../components/copyright/Copyright";
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from "react";
import Portas from "../../../portas";

import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function Home() {

    const { token } = useContext(StoreContext);
    const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
    const [alunosHomologacao, setAlunosHomologacao] = useState([]);
    const [alunosHomologados, setAlunosHomologados] = useState([]);

    const getSolicitacoes = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunosPendentes/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            console.log(resJSON)
            setSolicitacoesPendentes(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    

    const getAlunos = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();

            var array = [];
            var array2 = [];

            for (var i = 0; i < resJSON.length; i++) {
                if (resJSON[i].status_entrega === "Em Homologação") {
                    array.push(resJSON[i]);
                }
                if (resJSON[i].status_entrega === "Atividades entregues") {
                    array2.push(resJSON[i]);
                }
            }
            setAlunosHomologacao(array);
            setAlunosHomologados(array2)

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAlunos();
        getSolicitacoes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
                <h3 style={{fontWeight: "bold"}}>Bem vindo Admin</h3>
                <h4>Solicitações de Acesso: {solicitacoesPendentes.length}</h4>
                <h4>Alunos em Homologação: {alunosHomologacao.length}</h4>
                <h4>Alunos Homologados: {alunosHomologados.length}</h4>
                <br></br>
            </Paper>
            <Copyright></Copyright>
        </div>
    )
}