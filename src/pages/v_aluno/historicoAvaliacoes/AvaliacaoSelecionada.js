import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Portas from "../../../portas";
import Copyright from "../../copyright/Copyright";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import Button from '@material-ui/core/Button';

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

export default function AvaliacaoSelecionada(){

    const {id} = useParams();
    const { token } = useContext(StoreContext);
    const [atividades, setAtividades] = useState([]);

    const isValid = (id) => {
        if (id === "" || id === null || id === undefined) {
            return false;
        }
        else{
            return true;
        }
    }

    const openLink = (id) => {
        if (id === "" || id === null || id === undefined) {
            alert("Não foi cadastrado Link nessa atividade");
            return;
        }
        window.open(id, '_blank');
    }

    const openPdf = (id) => {
        console.log("entrei id: " + id);
        if (id === "" || id === null || id === undefined) {
            alert("Não foi cadastrado pdf nessa atividade");
            return;
        }
        const getPdf = async () => {
            try {
                const response = await fetch(Portas().serverHost + "/download/" + id,
                    {
                        method: "GET",
                    }
                );
                var resJSON = await response;
                console.log(id);
                console.log(resJSON)
                window.open(resJSON.url, '_blank');

            } catch (err) {
                console.log(err);
                alert("Houve um erro no GetPdf")
            }
        }

        getPdf();
    }

    const getAtividades = async () => {
        try {

            const body = { token, id};
            const response = await fetch(Portas().serverHost + "/atividadesAvaliadas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            setAtividades(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAtividades();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Inicio</th>
                            <th>Fim</th>
                            <th>Categoria</th>
                            <th>SubCategoria</th>
                            <th>QuantHoras</th>
                            <th>Descrição</th>
                            <th>Pdf</th>
                            <th>Horas Validas</th>
                            <th>FeedBack</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map(atividade => (
                            <tr key={atividade.id}>
                                <td>{atividade.titulo}</td>
                                <td>{atividade.data_inicio.replace(/-/gi,"/")}</td>
                                <td>{atividade.data_fim.replace(/-/gi,"/")}</td>
                                <td>{atividade.categoria}</td>
                                <td>{atividade.sub_categoria}</td>
                                <td>{atividade.quantidade_horas}</td>
                                <td>{atividade.descricao}</td>
                                <td>
                                    {isValid(atividade.nome_pdf)?
                                        <Button variant="contained" color="primary" style={{width: "110px"}} onClick={() => openPdf(atividade.nome_pdf)} >
                                            Abrir pdf
                                        </Button>
                                        :
                                        "Sem Anexo"
                                    }
                                </td>
                                <td>{atividade.horas_validas}</td>
                                <td>{atividade.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Paper>
            <Copyright></Copyright>
            
        </div>
    )
}