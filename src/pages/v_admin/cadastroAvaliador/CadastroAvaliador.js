import React, { Fragment, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavBar from '../NavBar';
import Grid from '@material-ui/core/Grid';
import Portas from "../../../portas";
import validator from 'validator';
import Copyright from "../../../components/copyright/Copyright";

//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

const { v4: uuidv4 } = require('uuid');


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
        },
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


export default function CadastroAvaliador() {
    const { token } = useContext(StoreContext);
    const classes = useStyles();
    const [nome, setNome] = useState("");
    const [matricula, setMatricula] = useState("");
    const [email, setEmail] = useState("");
    const [confEmail, setConfEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");

    const insertAvaliador = async() => {
        try {
            var usertoken = uuidv4();
            const body = { nome, matricula, email, senha, confEmail, confSenha, usertoken };
            console.log(body);

            const response = await fetch(Portas().serverHost + "/avaliadores/" + token, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON);
            window.location = "/manterAvaliadores";

        } catch (err) { }
    }

    const validarInsert = () => {
        if (nome === "" || matricula === "" || email === "" || confEmail === "" || senha === "" || confSenha === "") {
            alert("Há campos vazios!");
            return;
        }

        if (validator.isEmail(email) === false) {
            alert("Formato de email incorreto");
            return;
        }

        if (email !== confEmail) {
            alert("Emails não são iguais");
            return;
        }

        if (senha !== confSenha) {
            alert("Senhas não são iguais");
            return;
        }

        if (senha.length < 6) {
            alert("A senha precisa ter no minimo 6 caracteres");
            return;
        }

        insertAvaliador();
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.root}>
                <Grid >
                    <h2 style={{ textAlign: "center", marginLeft: "30px", marginRight: "30px", color: "blue" }}>Cadastrar Avaliador</h2>
                    <Paper elevation={10}>
                        <Fragment>
                            <div style={{ alignItems: "center", justifyContent: "center ", display: "grid", }}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="nome"
                                    label="Nome completo"
                                    value={nome}
                                    inputProps={{ maxLength: 199 }}
                                    onChange={e => setNome(e.target.value)}

                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="matricula"
                                    label="Matricula SIAPE"
                                    style={{ marginBottom: "15px" }}
                                    value={matricula}
                                    inputProps={{ maxLength: 49 }}
                                    onChange={e => setMatricula(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    value={email}
                                    inputProps={{ maxLength: 199 }}
                                    onChange={e => setEmail(e.target.value)}

                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="cf_email"
                                    label="Confirme o Email"
                                    value={confEmail}
                                    inputProps={{ maxLength: 199 }}
                                    onChange={e => setConfEmail(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Senha"
                                    type="password"
                                    id="senha"
                                    value={senha}
                                    inputProps={{ maxLength: 49 }}
                                    onChange={e => setSenha(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirme a senha"
                                    type="password"
                                    id="cf_senha"
                                    value={confSenha}
                                    inputProps={{ maxLength: 49 }}
                                    onChange={e => setConfSenha(e.target.value)}
                                />
                                <Button
                                    id="entrar"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: "10px", marginBottom: "20px" }}
                                    onClick={validarInsert}
                                >
                                    Cadastrar
                                </Button>
                            </div>
                        </Fragment>
                    </Paper>
                </Grid>
            </div>
            <Copyright></Copyright>
        </div>
    )
}