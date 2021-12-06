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
import Copyright from "../../components/copyright/Copyright";
import Portas from "../../portas";
import validator from 'validator';


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



export default function RecuperarSenha() {
    const classes = useStyles();
    const [email, setEmail] = useState("");

    const recuperarSenha = async () => {

        if (validator.isEmail(email) === false) {
            alert("formato de email incorreto");
            return;
        }

        try {
          const body = { email };
          const response = await fetch(Portas().serverHost + "/recuperarSenha",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            }
          );
    
          const resJSON = await response.json();
          alert(resJSON)
    
        } catch (err) {
          console.error(err.message);
        }
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
                        Recuperação de conta
                    </Typography>
                    <p style={{ textAlign: "center" }}>
                        Você receberá um email com instruções para recuperação de conta
                    </p>

                    <form className={classes.form} noValidate autoComplete="off">
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            value={email}
                            inputProps={{
                                maxLength: 199,
                                autocomplete: 'new-password',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <p style={{ textAlign: "center" }}>
                            *Insira o mesmo email usado para login no Chronos*
                        </p>
                        {/* in button if wnat join with enter type="submit"*/}
                        <Button
                            id="entrar"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={recuperarSenha}
                        >
                            Recuperar Senha
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