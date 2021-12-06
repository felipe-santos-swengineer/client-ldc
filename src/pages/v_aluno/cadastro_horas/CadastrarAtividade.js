import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import NavBar from '../NavBar';
import Portas from "../../../portas";
import Path from "path";
import Copyright from "../../../components/copyright/Copyright";

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function CadastrarAtividade() {
    const [categorias, setCategorias] = React.useState([]);
    const [subCategorias, setSubCategorias] = React.useState([]);
    const [subCategoriasAux, setSubCategoriasAux] = React.useState([]);
    const [categoria, setCategoria] = React.useState('');
    const [subCategoria, setSubCategoria] = React.useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const { token } = useContext(StoreContext);
    const [selectedDateInicio, setSelectedDateInicio] = React.useState(new Date());
    const [selectedDateFim, setSelectedDateFim] = React.useState(new Date());

    const handleDateChangeInicio = (date) => {
        setSelectedDateInicio(date);
    };

    const handleDateChangeFim = (date) => {
        setSelectedDateFim(date);
    };

    const changeHandler = (event) => {
        try {
            if (event.target.files[0].type !== "application/pdf" || event.target.files[0].type === undefined) {
                alert("Arquivo inválido, insira .pdf");
                return;
            }
            setSelectedFile(event.target.files[0]);
            setIsFilePicked(true);
        }
        catch (err) { };
    };

    const handleChangeSubCategoria = (event) => {
        setSubCategoria(event.target.value);
    }

    const handleChangeCategoria = (event) => {
        setCategoria(event.target.value);
        setSubCategoriasAux(subCategorias.filter(item => (item.id_categoria + "" === event.target.value)));
    }

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

    const cadastrar = () => {

        var titulo = document.getElementById("titulo").value;
        var descricao = document.getElementById("descricao").value;
        var link = "";
        var quantHoras = parseInt(document.getElementById("quantHoras").value, 10);
        var selectedCategoria = document.getElementById("categoria").value;
        var selectedSubCategoria = document.getElementById("subcategoria").value;
        var dataInicio = "";
        var dataFim = "";

        if (isFilePicked === false) {
            alert("Insira o documento PDF comprobatório");
            return;
        }

        if (selectedDateInicio.toString() === "Invalid Date") {
            alert("Erro na data de Inicio");
            return;
        }
        if (selectedDateFim.toString() === "Invalid Date") {
            alert("Erro na data de Fim");
            return;
        }

        console.log("Titulo: " + titulo + " descrição: " + descricao + " quantHoras: " + quantHoras + " link: " + link
            + " dataInicio: " + selectedDateInicio + " dataFim: " + selectedDateFim + " categoria: " + selectedCategoria + " subcategoria: " + selectedSubCategoria);

        //tratamentos

        if (titulo === "" || descricao === "" || quantHoras === "") {
            alert("Preencha todos os campos marcados com (*)");
            return;
        }

        if (quantHoras > 0) { }
        else {
            alert("Quantidade de horas inválida");
            return;
        }

        //tratamentos data
        var anoFim = selectedDateFim.getFullYear();
        var anoInicio = selectedDateInicio.getFullYear();
        var intAnoFim = parseInt(anoFim, 10);
        var intAnoInicio = parseInt(anoInicio, 10);
        var result = intAnoFim - intAnoInicio;
        var anoAtual = new Date().getFullYear();

        //se ano for no futuro
        if (intAnoInicio > anoAtual) {
            alert("Ano de inicio é está no futuro");
            return;
        }

        if (intAnoFim > anoAtual) {
            alert("Ano de fim está no futuro");
            return;
        }

        //se ano inicio é depois do ano fim 
        if (result < 0) {
            alert("Ano de inicio depois do ano de fim");
            return;
        }

        //mes
        var mesFim = selectedDateFim.getMonth() + 1;
        var mesInicio = selectedDateInicio.getMonth() + 1;
        var intMesFim = parseInt(mesFim, 10);
        var intMesInicio = parseInt(mesInicio, 10);
        var result1 = intMesFim - intMesInicio;

        var mesAtual = new Date().getMonth() + 1;
        console.log(mesAtual + " " + intMesInicio + " " + intMesFim);
        //se mes for no futuro
        if (intAnoInicio === anoAtual) {
            if (mesAtual < intMesInicio) {
                alert("Mês de inicio está no futuro");
                return;
            }
        }
        if (intAnoFim === anoAtual) {
            if (mesAtual < intMesFim) {
                alert("Mês de fim está no futuro");
                return;
            }
        }

        //se ano for igual
        if (result === 0) {
            //se mes inicio é depois de mes fim
            if (result1 < 0) {
                alert("Mês de inicio depois do mês de fim");
                return;
            }
        }

        //dia
        var diaFim = selectedDateFim.getDate();
        var diaInicio = selectedDateInicio.getDate();
        var intDiaFim = parseInt(diaFim, 10);
        var intDiaInicio = parseInt(diaInicio, 10);

        //se dia esta no futuro
        var diaAtual = new Date().getDate();
        
        if (intAnoInicio === anoAtual) {
            if (intMesInicio === mesAtual) {
                if (diaAtual < intDiaInicio) {
                    alert("Dia de inicio está no futuro");
                    return;
                }
            }
        }

        if (intAnoFim === anoAtual) {
            if (intMesFim === mesAtual) {
                if (diaAtual < intDiaFim) {
                    alert("Dia de fim está no futuro");
                    return;
                }
            }
        }

        //se ano e mes for iguais, verifique se intervalo de dias é valido
        if (result === 0) {
            if (result1 === 0) {
                if (intDiaFim < intDiaInicio) {
                    alert("Dia de Inicio depois do dia de Fim");
                    return;
                }
            }
        }

        //Tornar padrão de data para o postgres
        var dia, mes, ano;
        if (selectedDateInicio.getMonth() + 1 < 10) {
            dia = selectedDateInicio.getDate();
            mes = selectedDateInicio.getMonth() + 1;
            ano = selectedDateInicio.getFullYear();
            dataInicio = dia + "-0" + mes + "-" + ano;
            if (dia < 10) {
                dataInicio = "0" + dia + "-0" + mes + "-" + ano;
            }
        }
        else {
            dia = selectedDateInicio.getDate();
            mes = selectedDateInicio.getMonth() + 1;
            ano = selectedDateInicio.getFullYear();
            dataInicio = dia + "-" + mes + "-" + ano;
            if (dia < 10) {
                dataInicio = "0" + dia + "-" + mes + "-" + ano;
            }
        }

        if (selectedDateFim.getMonth() + 1 < 10) {
            dia = selectedDateFim.getDate();
            mes = selectedDateFim.getMonth() + 1;
            ano = selectedDateFim.getFullYear();
            dataFim = dia + "-0" + mes + "-" + ano;
            if (dia < 10) {
                dataFim = "0" + dia + "-0" + mes + "-" + ano;
            }
        }
        else {
            dia = selectedDateFim.getDate();
            mes = selectedDateFim.getMonth() + 1;
            ano = selectedDateFim.getFullYear();
            dataFim = dia + "-" + mes + "-" + ano;
            if (dia < 10) {
                dataFim = "0" + dia + "-" + mes + "-" + ano;
            }
        }


        const insertAtividadeComPdf = async () => {
            try {
                var nomePdf = token + Date.now() + Path.extname(selectedFile.name);

                const myInput = document.getElementById('inputPdf');
                console.log(myInput.files[0]);

                const responsePdf = await fetch(Portas().serverHost + "/atividades/pdf/" + nomePdf, {
                    method: "POST",
                    body: myInput.files[0]
                });

                var resJSON1 = await responsePdf.json();
                if (resJSON1 !== "PDF Cadastrado") {
                    alert("Falha no Upload do arquivo");
                    return;
                }

                const body = { nomePdf, titulo, dataInicio, dataFim, descricao, link, quantHoras, selectedCategoria, selectedSubCategoria, token };
                console.log(body);
                const response = await fetch(Portas().serverHost + "/atividades", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                alert(resJSON);
                window.location = "/manterAtividades";


            } catch (err) {
                console.log(err.message);
            }
        }

        const insertAtividade = async () => {
            try {
                var nomePdf = "";
                const body = { titulo, dataInicio, dataFim, descricao, link, quantHoras, selectedCategoria, selectedSubCategoria, token, nomePdf };
                const response = await fetch(Portas().serverHost + "/atividades", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                alert(resJSON);
                window.location = "/manterAtividades";

            } catch (err) {
                console.log(err.message);
            }
        }


        if (isFilePicked) {
            console.log("Enviando com pdf: ")
            insertAtividadeComPdf();
        }
        else {
            console.log("Enviando sem pdf")
            insertAtividade();
        }

    }

    const getVersao = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/versao/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            setCategorias(resJSON[0]);
            setCategoria(1)
            setSubCategorias(resJSON[1]);
            setSubCategoriasAux(resJSON[1].filter(item => (item.id_categoria === 1)));
            setSubCategoria(1)

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getVersao();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "10px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                <form noValidate autoComplete="off">
                    <h2 style={{ textAlign: "center", marginTop: '10px' }}>Formulário de Cadastro</h2>
                    <div style={{ alignItems: "center", justifyContent: "center ", display: "grid", }}>
                        <TextField
                            style={{ marginTop: "5px" }}
                            id="titulo"
                            label="Titulo*"
                            type="search"
                            variant="outlined"
                            inputProps={{ maxLength: 199 }}
                        />

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="DataInicio"
                                label="Data de Inicio*"
                                format="dd/MM/yyyy"
                                value={selectedDateInicio}
                                onChange={handleDateChangeInicio}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                margin="normal"
                                id="dataFim"
                                label="Data de Fim*"
                                format="dd/MM/yyyy"
                                value={selectedDateFim}
                                onChange={handleDateChangeFim}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>

                        <TextField
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            id="categoria"
                            select
                            label="Categoria*"
                            value={categoria}
                            onChange={handleChangeCategoria}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {categorias.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {romanize(option.id) + " - " + option.nome}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            id="subcategoria"
                            select
                            label="Sub-Categoria*"
                            value={subCategoria}
                            onChange={handleChangeSubCategoria}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {subCategoriasAux.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {romanize(option.id) + " - " + option.nome}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            id="quantHoras"
                            label="Quantidade de Horas*"
                            type="number"
                            defaultValue={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onInput={(e) => {
                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                            }}
                        />

                        <TextField
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            id="descricao"
                            label="Descrição*"
                            multiline
                            rows={4}
                            type="search"
                            variant="outlined"
                            inputProps={{ maxLength: 4999 }} />

                    </div>
                    <form id="pdfField" method="post" encType="multipart/form-data">
                        <input id="inputPdf" type="file" name="file" accept="application/pdf" onChange={changeHandler} style={{ marginBottom: "5px" }} />
                    </form>
                    <p style={{}}>Somente arquivos .pdf</p>
                    <Button variant="contained" color="primary" onClick={cadastrar} style={{ marginTop: "10px", marginBottom: "20px" }}>
                        Adicionar atividade
                    </Button>
                </form>
            </Paper>
            <Copyright></Copyright>
        </div>
    );
}

