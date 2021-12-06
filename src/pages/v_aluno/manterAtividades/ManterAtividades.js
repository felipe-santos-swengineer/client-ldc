import React, { useEffect, useState } from "react";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import NavBar from '../NavBar';
import Portas from "../../../portas";
import Paper from '@material-ui/core/Paper';
import Table from 'react-bootstrap/Table';
import TextField from '@material-ui/core/TextField';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Path from "path";
import Copyright from "../../../components/copyright/Copyright";
import "./manterAtividades.css";
import Button from '@material-ui/core/Button';


//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function ManterAtividades() {
    const { token } = useContext(StoreContext);
    const [categorias, setCategorias] = React.useState([]);
    const [subCategorias, setSubCategorias] = React.useState([]);
    const [subCategoriasAux, setSubCategoriasAux] = React.useState([]);
    const [atividades, setAtividades] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [titulo, setTitulo] = useState();
    const [categoria, setCategoria] = React.useState('');
    const [subCategoria, setSubCategoria] = React.useState('');
    const [quantHoras, setQuantHoras] = React.useState('');
    const [docLink, setDocLink] = React.useState('');
    const [pdf, setPdf] = React.useState('');
    const [descricao, setDescricao] = React.useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [selectedDateInicio, setSelectedDateInicio] = React.useState(new Date());
    const [selectedDateFim, setSelectedDateFim] = React.useState(new Date());
    const [editID, setEditID] = useState();
    const [nomeAntigoPdf, setNomeAntigoPdf] = React.useState();

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

    const isValid = (id) => {
        if (id === "" || id === null || id === undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    const handleDateChangeInicio = (date) => {
        setSelectedDateInicio(date);
    };

    const handleDateChangeFim = (date) => {
        setSelectedDateFim(date);
    };

    const changeHandlerPdf = (event) => {
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

    //pegar registros de atividades
    const getAtividades = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/atividades/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            setAtividades(resJSON);
            getVersao();

        } catch (err) {
            alert(err);
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

    const openPdf = (id) => {
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

    const toDate = (data) => {
        const newDate = new Date(data[6] + data[7] + data[8] + data[9] + "-" + data[3] + data[4] + "-" + data[0] + data[1] + "T06:00:00Z");
        return newDate;
    }

    const handleOpen = (id) => {
        console.log("Opened row: " + editID);
        setEditID(id);
        setOpen(true);

        //preencher campos com registro selecionado 
        for (var i = 0; i < atividades.length; i++) {
            if (atividades[i].id === id) {
                setNomeAntigoPdf(atividades[i].nome_pdf);
                setTitulo(atividades[i].titulo);
                setCategoria(atividades[i].categoria);
                setSubCategoria(atividades[i].sub_categoria);
                setQuantHoras(atividades[i].quantidade_horas);
                setDescricao(atividades[i].descricao);
                setPdf(atividades[i].nome_pdf);
                setDocLink("");
                setSelectedDateInicio(toDate(atividades[i].data_inicio));
                setSelectedDateFim(toDate(atividades[i].data_fim));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const body = { token }
            const response = await fetch(Portas().serverHost + "/atividades/" + id,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            var resJSON = await response.json();
            alert(resJSON);
            window.location = "/manterAtividades";

        } catch (err) {
            console.log(err);
            alert("Houve um erro")
        }
    }

    const updateAtividade = async () => {
        console.log("updating row: " + editID);
        var selectedCategoria = categoria;
        var selectedSubCategoria = subCategoria;
        var dataInicio = "";
        var dataFim = "";

        if (selectedDateInicio.toString() === "Invalid Date") {
            alert("Erro na data de Inicio");
            return;
        }
        if (selectedDateFim.toString() === "Invalid Date") {
            alert("Erro na data de Fim");
            return;
        }

        console.log("Titulo: " + titulo + " descrição: " + descricao + " quantHoras: " + quantHoras + " link: " + docLink
            + " dataInicio: " + selectedDateInicio + " dataFim: " + selectedDateFim + " categoria: " + selectedCategoria + " subcategoria: " + selectedSubCategoria);

        //tratamentos

        if (titulo === "" || descricao === "" || quantHoras === "") {
            alert("Preencha todos os campos marcados com (*)");
            return;
        }

        if (quantHoras < 1) {
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
            alert("Ano de inicio está no futuro");
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

        //fazer o update 
        const UpdateAtividadeComPdf = async () => {
            try {
                var nomePdf = token + Date.now() + Path.extname(selectedFile.name);

                console.log("input:")

                const responsePdf = await fetch(Portas().serverHost + "/atividades/pdf/" + nomePdf, {
                    method: "POST",
                    body: selectedFile
                });

                var resJSON1 = await responsePdf.json();
                if (resJSON1 !== "PDF Cadastrado") {
                    console.log("erro")
                    alert("Falha no Upload do arquivo");
                    return;
                }

                const body = { nomePdf, titulo, dataInicio, dataFim, descricao, docLink, quantHoras, selectedCategoria, selectedSubCategoria, token, nomeAntigoPdf };
                console.log(body);
                const response = await fetch(Portas().serverHost + "/atividades/pdf/" + editID, {
                    method: "PUT",
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

        const updateAtividadeSemPdf = async () => {
            try {
                const nomePdf = pdf;
                const body = { nomePdf, titulo, dataInicio, dataFim, descricao, docLink, quantHoras, selectedCategoria, selectedSubCategoria, token };
                const response = await fetch(Portas().serverHost + "/atividades/" + editID, {
                    method: "PUT",
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
            UpdateAtividadeComPdf();
        }
        else {
            console.log("Enviando sem pdf")
            updateAtividadeSemPdf();
        }
    }


    useEffect(() => {
        getAtividades();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
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
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map(atividade => (
                            <tr key={atividade.id}>
                                <td>{atividade.titulo}</td>
                                <td>{atividade.data_inicio.replace(/-/gi, "/")}</td>
                                <td>{atividade.data_fim.replace(/-/gi, "/")}</td>
                                <td>{romanize(atividade.categoria)}</td>
                                <td>{romanize(atividade.sub_categoria)}</td>
                                <td>{atividade.quantidade_horas}</td>
                                <td>{atividade.descricao}</td>
                                <td>
                                    {isValid(atividade.nome_pdf) ?
                                        <Button variant="outlined" color="primary" onClick={() => openPdf(atividade.nome_pdf)} >
                                            Abrir
                                        </Button>
                                        :
                                        "Sem Anexo"
                                    }
                                </td>
                                <td>
                                    <Button variant="contained" color="primary" onClick={() => handleOpen(atividade.id)} >
                                        Editar
                                    </Button>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        classNames={{

                                            modal: 'customModal',
                                        }}

                                    >
                                        <h1 style={{ textAlign: "center", marginTop: "30px" }}>Editar Atividade</h1>
                                        <div>
                                            <form noValidate autoComplete="off">
                                                <div style={{ alignItems: "center", justifyContent: "center ", display: "grid" }}>
                                                    <TextField
                                                        style={{ marginTop: "15px" }}
                                                        label="Titulo*"
                                                        type="search"
                                                        variant="outlined"
                                                        value={titulo}
                                                        inputProps={{ maxLength: 199 }}
                                                        onChange={e => setTitulo(e.target.value)} />

                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDatePicker
                                                            style={{ marginTop: "15px" }}
                                                            margin="normal"
                                                            label="Data de Inicio*"
                                                            format="dd/MM/yyyy"
                                                            value={selectedDateInicio}
                                                            onChange={handleDateChangeInicio}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date',
                                                            }}
                                                        />
                                                        <KeyboardDatePicker
                                                            style={{ marginTop: "15px" }}
                                                            margin="normal"
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
                                                        style={{ marginTop: "15px" }}
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
                                                        style={{ marginTop: "15px" }}
                                                        select
                                                        label="Sub Categoria*"
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
                                                        style={{ marginTop: "15px" }}
                                                        label="Quantidade de Horas*"
                                                        type="number"
                                                        defaultValue={0}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        value={quantHoras}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                                                        }}
                                                        onChange={e => setQuantHoras(e.target.value)}
                                                    />

                                                    <TextField
                                                        style={{ marginTop: "15px" }}
                                                        label="Descrição*"
                                                        multiline
                                                        rows={4}
                                                        type="search"
                                                        variant="outlined"
                                                        value={descricao}
                                                        inputProps={{ maxLength: 4999 }}
                                                        onChange={e => setDescricao(e.target.value)} />

                                                </div>
                                                <form method="post" encType="multipart/form-data" style={{ marginTop: "15px", textAlign: "center" }}>
                                                    <input type="file" name="file" accept="application/pdf" onChange={changeHandlerPdf} style={{ marginBottom: "5px", textAlign: "center" }} />
                                                </form>
                                                <h4 style={{ textAlign: "center", fontSize: "10px" }}>Somente arquivos .pdf</h4>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={updateAtividade}
                                                    style={{ marginTop: "10px", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}
                                                >
                                                    Editar
                                                </button>
                                            </form>
                                        </div>
                                    </Modal>
                                </td>
                                <td>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(atividade.id)} >
                                        Deletar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Paper >
            <Copyright></Copyright>
        </div >
    )
}