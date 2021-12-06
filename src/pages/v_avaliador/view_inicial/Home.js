import NavBar from "../NavBar";
import Copyright from "../../../components/copyright/Copyright";
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from "react";
import Portas from "../../../portas";



import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

export default function Home() {

    const { token } = useContext(StoreContext);
    const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
    const [solicitacoesAvaliadas, setSolicitacoesAvaliadas] = useState([]);
    const [nome, setNome] = useState("");

    const getAvaliador = async () => {
        try {
          const body = { token };
          const response = await fetch(Portas().serverHost + "/getAvaliador",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            }
          );
        
          const resJSON = await response.json();
          if(resJSON.length < 1){
              return;
          }

          setNome(resJSON.nome);
          
        } catch (err) {
          console.error(err.message);
        }
      }

    const getSolicitacoes = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/avaliadorSolicitacoes/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            var array = [];
            var array2 = [];
            for(var i = 0; i < resJSON.length; i++){
                if(resJSON[i].status === "Pendente"){
                    array.push(resJSON[i])
                }
                else {
                    array2.push(resJSON[i])
                }
            }
            setSolicitacoesPendentes(array);
            setSolicitacoesAvaliadas(array2);

        }
        catch (err) {
        }
    }

    useEffect(() => {
        getAvaliador();
        getSolicitacoes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
                <h3 style={{fontWeight: "bold"}}>Bem vindo Avaliador: {nome}</h3>
                <h4>Avaliações pendentes: {solicitacoesPendentes.length}</h4>
                <h4>Avaliações concluidas: {solicitacoesAvaliadas.length}</h4>
                <br></br>
            </Paper>
            <Copyright></Copyright>
        </div>
    )
}