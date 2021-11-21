import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import validator from 'validator';
import Portas from "../../portas";
import Copyright from "../../components/copyright/Copyright";
const { v4: uuidv4 } = require('uuid');



const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: "url('./background/bg1.jpg')",
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(0),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const cursos = [
    {
        value: 'Engenharia de Software',
        label: 'Engenharia de Software',
    },
    {
        value: 'Ciência da Computação',
        label: 'Ciência da Computação',
    },
    {
        value: 'Engenharia Civil',
        label: 'Engenharia Civil',
    },
    {
        value: 'Engenharia da Produção',
        label: 'Engenharia da Produção',
    }
];


export default function SignInSide() {
    const classes = useStyles();
    const [curso, setCurso] = useState('Engenharia de Software');
    const [nome, setNome] = useState("");
    const [matricula, setMatricula] = useState("");
    const [email, setEmail] = useState("");
    const [confEmail, setConfEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");

    const handleChangeCurso = (event) => {
        setCurso(event.target.value);
    };


    function validarCadastro() {

        if (nome === "" || matricula === "" || curso === "" || email === "" || confEmail === ""
            || senha === "" || confSenha === "") {
            alert("Por favor, preencha todos os campos");
            return;
        }

        if (validator.isEmail(email) === false) {
            alert("formato de email incorreto");
            return;
        }

        if (email !== confEmail) {
            alert("Emails diferentes");
            return;
        }

        if (senha.length < 6) {
            alert("Senha com menos de 6 digitos");
            return;
        }

        if (senha !== confSenha) {
            alert("Senhas diferentes")
            return;
        }

        var usertoken = uuidv4();

        //inserção no banco de alunos que precisam ser aprovados pela administração
        const insertAluno = async () => {
            try {
                const body = { nome, email, senha, matricula, curso, usertoken, confEmail, confSenha };
                console.log(body);
                const response = await fetch(Portas().serverHost + "/alunosPendentes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                alert(resJSON);

                if (resJSON === "Cadastro solicitado ao Administrador!") {
                    window.location = "/";
                }

            } catch (err) {
                console.log(err.message);
            }
        }

        insertAluno();
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} id="image" />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar alt="LDC Icone" className={classes.avatar} src="./plc_logo.ico">
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cadastro de aluno
                    </Typography>
                    <form className={classes.form} noValidate autoComplete="off">
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
                            label="Matricula"
                            style={{ marginBottom: "15px" }}
                            value={matricula}
                            inputProps={{ maxLength: 49 }}
                            onChange={e => setMatricula(e.target.value)}
                        />
                        <TextField
                            id="curso"
                            select
                            label="curso"
                            value={curso}
                            onChange={handleChangeCurso}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {cursos.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
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
                        {/* in button if wnat join with enter type="submit"*/}
                        <Button
                            id="entrar"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={validarCadastro}
                        >
                            Cadastrar
                        </Button>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}