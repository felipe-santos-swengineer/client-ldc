import NavBar from "../NavBar";
import Copyright from "../../../components/copyright/Copyright";
import React, { useEffect, useState } from "react";
import Portas from "../../../portas";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

export default function AvaliarAtividadeSelecionada() {

    const { id } = useParams();
    const { token } = useContext(StoreContext);
    const [atividades, setAtividades] = useState([]);

    const isValid = (id) => {
        if (id === "" || id === null || id === undefined) {
            return false;
        }
        else {
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

            const body = { token, id };
            const response = await fetch(Portas().serverHost + "/atividadesAvaliacao", {
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


    const finalizarSubmissao = async (id_avaliacao) => {

        //calcular se aluno entregou as atividades
        var i_ = 0;
        var ii_ = 0;
        var iii_ = 0;
        var iv_ = 0;
        var v_ = 0;
        var vi_ = 0;
        var vii_ = 0;
        for (var j = 0; j < atividades.length; j++) {
            switch (atividades[j].categoria) {
                case 'I':
                    i_ = i_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'II':
                    ii_ = ii_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'III':
                    iii_ = iii_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'IV':
                    iv_ = iv_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'V':
                    v_ = v_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'VI':
                    vi_ = vi_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                case 'VII':
                    vii_ = vii_ + parseFloat(atividades[j].quantidade_horas);
                    break;
                default:
                    console.log("Algo inesperado ocorreu");
            }
        }

        console.log(i_ + " " + ii_ + " " + iii_ + " " + iv_ + " " + v_ + " " + vi_ + " " + vii_);

        if (i_ > 96) {
            i_ = 96;
        }
        if (ii_ > 64) {
            ii_ = 64;
        }
        if (iii_ > 32) {
            iii_ = 32;
        }
        if (iv_ > 64) {
            iv_ = 64;
        }
        if (v_ > 96) {
            v_ = 96;
        }
        if (vi_ > 48) {
            vi_ = 48;
        }
        if (vii_ > 48) {
            vii_ = 48;
        }

        var soma = i_ + ii_ + iii_ + iv_ + v_ + vi_ + vii_;
        if(soma >= 288){
            try {
                const body = { id_avaliacao,token }
                const response = await fetch(Portas().serverHost + "/aprovarAtividades", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
    
                var resJSON1 = await response.json();
                console.log(resJSON1);
    
            }
            catch (err) {
            }
        }


        try {
            const body = { id_avaliacao, token }
            const response = await fetch(Portas().serverHost + "/finalizarAvaliacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON);
            window.location = "/historicoAvaliacoes";

        }
        catch (err) {
            alert("um erro ocorreu");
            return;
        }
    }

    const enviarAvaliacao = () => {

        var successCount = 0;

        const update = async (id, feedback, quantHoras) => {
            try {
                const body = { id, token, quantHoras, feedback}
                const response = await fetch(Portas().serverHost + "/enviarAvaliacao", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON);
                successCount += 1;

                if (successCount === atividades.length) {
                    finalizarSubmissao(atividades[0].id_avaliacao);
                }

            }
            catch (err) {
                alert("um erro ocorreu");
                return;
            }
        }

        var itemFeedback;
        var itemHoras;

        for (var i = 0; i < atividades.length; i++) {
            itemFeedback = document.getElementById("feedback-" + atividades[i].id).value;
            if (itemFeedback === "") {
                itemFeedback = "Atividade sem irregularidades";
            }
            
            itemHoras = parseInt(document.getElementById("quantHoras-" + atividades[i].id).value, 10);
            if (itemHoras >= 0) {}
            else{
                itemHoras = 0;
            }

            update(atividades[i].id, itemFeedback, itemHoras);
        }
    }


    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
                <h4 style={{ marginTop: "15px", textAlign: "center", fontSize: "10px", color: "orange" }}>Se o campo de feedback ficar vazio, o sistema automaticamente sustituirá por "Atividade sem irregularidades"</h4>
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
                            <th>Link</th>
                            <th>Pdf</th>
                            <th>Horas Validas</th>
                            <th>FeedBack</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map(atividade => (
                            <tr key={atividade.id}>
                                <td>{atividade.titulo}</td>
                                <td>{atividade.data_inicio.replace(/-/gi, "/")}</td>
                                <td>{atividade.data_fim.replace(/-/gi, "/")}</td>
                                <td>{atividade.categoria}</td>
                                <td>{atividade.sub_categoria}</td>
                                <td>{atividade.quantidade_horas}</td>
                                <td>{atividade.descricao}</td>
                                <td>
                                    {isValid(atividade.doc_link) ?
                                        <Button variant="contained" color="primary" style={{ width: "110px" }} onClick={() => openLink(atividade.doc_link)} >
                                            Abrir link
                                        </Button>
                                        :
                                        "Sem Anexo"
                                    }
                                </td>
                                <td>
                                    {isValid(atividade.nome_pdf) ?
                                        <Button variant="contained" color="primary" style={{ width: "110px" }} onClick={() => openPdf(atividade.nome_pdf)} >
                                            Abrir pdf
                                        </Button>
                                        :
                                        "Sem Anexo"
                                    }
                                </td>
                                <td>
                                    <TextField
                                        id={"quantHoras-" + atividade.id}
                                        label=""
                                        type="number"
                                        defaultValue={0}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                                        }}
                                        style={{ width: 100 }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id={"feedback-" + atividade.id}
                                        placeholder="Atividade irregular por motivos x,y..."
                                        multiline
                                        variant="outlined"
                                        style={{ width: 300 }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div style={{ textAlign: "center" }}>
                    <button className="btn btn-success" style={{ marginBottom: "10px", marginTop: "10px" }} onClick={enviarAvaliacao}>
                        Enviar Avaliação
                    </button>
                </div>
            </Paper>

            <Copyright></Copyright>
        </div >
    )
}