import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Portas from "../../portas";
import Copyright from "../../components/copyright/Copyright";

//auth
import { useContext } from 'react';
import StoreContext from "../../components/Store/Context";


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

export default function SignInSide() {
  const classes = useStyles();
  const [render, setRender] = useState(true);
  const { setToken } = useContext(StoreContext);
  const { token } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  if (token) {
    setRender(false);
    const redirect = async () => {
      try {
        const response = await fetch(Portas().serverHost + "/verify/" + token,
          {
            method: "GET",
          }
        );

        const resJSON = await response.json();
        console.log(resJSON);

        if (resJSON === "aluno") {
          window.location = "/alunoHome";
          return;
        }
        if (resJSON === "avaliador") {
          window.location = "/avaliadorHome";
          return;
        }
        if (resJSON === "admin") {
          window.location = "/adminHome";
          return;
        }
        
      } catch (err) {
        console.error(err.message);
      }
    }
    redirect();
  }

  const login = (resJSON, email, senha) => {
    console.log(resJSON.email + " " + resJSON.senha + " " + resJSON.usertoken);

    if (email === resJSON.email && senha === resJSON.senha) {
      setToken(resJSON.usertoken);
    }

    else {
      alert("Login falhou!");
    }

  }

  const validar_login_avaliador = async (email, senha) => {
    try {
      const body = { email, senha };
      const response = await fetch(Portas().serverHost + "/avaliadores-verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const resJSON = await response.json();
      console.log(resJSON);

      if(resJSON.ativo === false){
        alert("O administrador suspendeu seu acesso, se isso foi um erro, comunique-nos!");
        return;
      }

      if (resJSON.email === email && resJSON.senha === senha) {
        login(resJSON, email, senha);
        return;
      }
      else {
        alert("Usuário inválido")
        return;
      }

    } catch (err) {
      console.error(err.message);
    }
  }

  const validar_login_admin = async (email, senha) => {
    try {
      const body = { email, senha };
      const response = await fetch(Portas().serverHost + "/admins/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const resJSON = await response.json();
      console.log(resJSON);

      if(resJSON.ativo === false){
        alert("O administrador suspendeu seu acesso, se isso foi um erro, comunique-nos!");
        return;
      }

      if (resJSON.email === email && resJSON.senha === senha) {
        login(resJSON, email, senha);
        return;
      }
      else {
        validar_login_avaliador(email, senha)
        return;
      }

    } catch (err) {
      console.error(err.message);
    }
  }

  //função que verifica se o usuario existe na tabela de pendentes
  const validar_login_pendentes = async (email, senha) => {
    try {
      const body = { email, senha };
      const response = await fetch(Portas().serverHost + "/alunos/verifyP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const resJSON = await response.json();
      console.log(resJSON);

      if (resJSON.email === email && resJSON.senha === senha) {
        alert("Usuário ainda não foi aprovado pelo Administrador!");
        return;
      }
      else {
        validar_login_admin(email, senha);
        return;
      }

    } catch (err) {
      console.error(err.message);
    }
  }

  //função que verifica se o usuario existe
  const validar_login = async () => {

    console.log(email + " " + senha);

    if (email === "" || senha === "") {
      alert("Campos não preenchidos");
      return;
    }

    try {
      const body = { email, senha };
      const response = await fetch(Portas().serverHost + "/alunos/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const resJSON = await response.json();
      console.log(resJSON)

      if(resJSON.ativo === false){
        alert("O administrador suspendeu seu acesso, se isso foi um erro, comunique-nos!");
        return;
      }

      if (resJSON.email === email && resJSON.senha === senha) {
        login(resJSON, email, senha);
      }
      else {
        validar_login_pendentes(email, senha);
      }


    } catch (err) {
      console.error(err.message);
    }
  }

  if(render){
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} id="image" />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar alt="LDC Icone" className={classes.avatar} src="./plc_logo.ico">
          </Avatar>
          <Typography component="h1" variant="h5">
            Acesso ao Sistema
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              inputProps={{ maxLength: 199 }}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={senha}
              inputProps={{ maxLength: 49 }}
              onChange={e => setSenha(e.target.value)}
            />
            {/* in button if wnat join with enter type="submit"*/}
            <Button
              id="entrar"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={validar_login}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/recuperarSenha" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/cadastro" variant="body2">
                  {"Não tem conta? Cadastre-se!"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
else{
  return( <div></div>)
}
}