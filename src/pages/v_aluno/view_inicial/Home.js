import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Paper from '@material-ui/core/Paper';
import { Chart } from "react-google-charts";
import Portas from "../../../portas";
import Copyright from "../../../components/copyright/Copyright";


//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';


export default function Home(){
    const { token } = useContext(StoreContext);
    const [status, setStatus] = useState("");
    const [options, setOptions] = useState();
    const [optionsBar, setOptionsBar] = useState();
    const [data, setData] = useState([
        ["A", "Horas Inseridas"],
        ["Nenhuma", 1]

    ]);
    const [aluno, setAluno] = useState([]);
    const [dataTotal, setDataTotal] = useState([]);
    const [optionsTotal, setOptionsTotal] = useState();
    const [dataBar, setDataBar] = useState([]);

    function romanize(num) {
        var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
        for (i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    }

    const somarAtividades = (categorias, subCategorias, versao, atividades) => {
        //somar atividades
        var data = [["A", "Horas Inseridas"]];
        var data2 = [['Categorias', 'Horas Cadastradas', 'Limite da categoria']]
        var soma = 0;
        var somaTotal = 0;

        for (var j = 0; j < categorias.length; j++) {
            for (var i = 0; i < atividades.length; i++) {
                if(categorias[j].id == atividades[i].categoria) {
                    soma = soma + parseFloat(atividades[i].quantidade_horas);
                }
            }
            if(soma > parseFloat(categorias[j].horas)){
                soma = parseFloat(categorias[j].horas)
            }
            data.push([romanize(categorias[j].id), soma]);
            data2.push([romanize(categorias[j].id), soma, parseFloat(categorias[j].horas)])
            somaTotal = somaTotal + soma;
            soma = 0;
        }
        
        setOptions({
            title: 'Proporção das horas Cadastradas por critério'
        });

        setOptionsTotal({
            title: 'Progresso Total para Engenharia de Software'
        });

        setOptionsBar({
            title: 'Progresso por categorias para Engenharia de Software'
        });

        setDataTotal(
            [
                ['Categorias', 'Horas Cadastradas', 'Horas necessárias para o curso'],
                ['Contador de Horas', somaTotal, parseFloat(versao.horas)],
            ]
        )
        
        if(somaTotal > 0)
        setData(data)

        setDataBar(
            data2
        )
    }

    //pegar registros de atividades
    const getAtividades = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/atividades/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            getVersao(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    const getStatus = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/byToken/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            setStatus(resJSON.status_entrega);

        } catch (err) {
            console.log(err)
        }
    }

    const getVersao = async (atividades) => {
        try {
            const response = await fetch(Portas().serverHost + "/versao/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            somarAtividades(resJSON[0], resJSON[1], resJSON[2], atividades);

        } catch (err) {
            alert(err);
        }
    }

    const getAluno = async (atividades) => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/bytoken/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            setAluno(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAluno();
        getAtividades();
        getStatus();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
                <h1>Status das atividades:</h1>
                <h4>{aluno.nome}</h4>
                <h4>{"{" + status + "}"}</h4>
                <br></br>
            </Paper>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>

                <h1>Resumo de atividades (Considerando Limites) </h1>

                <div style={{ width: "100%" }}>
                    <Chart
                        width="100%"
                        height="300px"
                        chartType="PieChart"
                        data={data}
                        options={options}
                    />

                </div>
                <div style={{ width: "90vw", display: "flex" }}>
                    <Chart
                        width="45vw"
                        chartType="BarChart"
                        data={dataBar}
                        options={optionsBar}
                    />
                    <Chart
                        width="45vw"
                        chartType="BarChart"
                        data={dataTotal}
                        options={optionsTotal}
                    />
                </div>
            </Paper>
            <Copyright></Copyright>
        </div>
    )
}