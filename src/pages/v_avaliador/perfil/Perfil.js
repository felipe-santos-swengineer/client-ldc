import NavBar from "../NavBar";
import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Portas from "../../../portas";

import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';
import Button from '@material-ui/core/Button';
import validator from 'validator';

export default function Perfil() {

    const { token } = useContext(StoreContext);
    const [avaliador, setAvaliador] = useState([]);
    const [emailNovo, setEmailNovo] = useState("");
    const [senhaNova, setSenhaNova] = useState("");

    const getAvaliador = async (atividades) => {
        try {
            const body = { token };
            const response = await fetch(Portas().serverHost + "/getAvaliador", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            setAvaliador(resJSON);


        } catch (err) {
            console.log(err.message);
        }
    }

    const update = async () => {
        //alert(emailNovo + " " + senhaNova);
        if (emailNovo === "" && senhaNova === "") {
            alert("Nada para atualizar");
            return;
        }

        if (emailNovo.length > 0) {
            if (validator.isEmail(emailNovo) === false) {
                alert("formato de email incorreto");
                return;
            }
        }

        if (senhaNova.length > 0) {
            if (senhaNova.length < 6) {
                alert("Senha precisa ter no minimo 6 caracteres")
                return;
            }
        }

        try {
            const body = { emailNovo, senhaNova};
            const response = await fetch(Portas().serverHost + "/updateAvaliador/" + token, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON1 = await response.json();
            console.log(resJSON1);
            window.location = "/avaliadorPerfil";

        } catch (err) {
            console.log(err.message);
        }
    }

    const dataFormatoBr = (timestamp) => {
        timestamp = timestamp.substring(0, 10);
        timestamp = timestamp[8] + timestamp[9] + "/" + timestamp[5] + timestamp[6] + "/" + timestamp[0] + timestamp[1] + timestamp[2] + timestamp[3];
        return timestamp;
    }


    useEffect(() => {
        getAvaliador();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ display: "flex", textAlign: "center", marginTop: "10px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                <div style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", justifyItems: "center", alignItems: "center" }}>
                    <h4>{avaliador.nome}</h4>
                    <div>
                        <p>Siape: {avaliador.matricula}</p>
                        <p>Email: {avaliador.email}</p>
                        <p>Membro desde: {avaliador.data_criacao !== undefined? dataFormatoBr(avaliador.data_criacao) : <div></div>}</p>
                    </div>
                </div>
                <form noValidate autoComplete="off" style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center ", paddingRight: "5px" }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="email"
                        label="Email Novo"
                        value={emailNovo}
                        inputProps={{
                            maxLength: 199,
                            autocomplete: 'new-password',
                            form: {
                                autocomplete: 'off',
                            },
                        }}
                        onChange={e => setEmailNovo(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label="Senha Nova"
                        type="password"
                        value={senhaNova}
                        inputProps={{
                            maxLength: 49,
                            autocomplete: 'new-password',
                            form: {
                                autocomplete: 'off',
                            },
                        }}
                        onChange={e => setSenhaNova(e.target.value)}
                    />
                    <Button onClick={update} variant="contained" color="primary" style={{ marginBottom: "5px", marginTop: "5px" }}>
                        Atualizar
                    </Button>
                </form>
            </Paper>

        </div>
    )
}