import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

//pages import
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/cadastro_aluno";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha";
import Aluno_Home from "./pages/v_aluno/view_inicial/Home";
import Aluno_Perfil from "./pages/v_aluno/perfil/Perfil";
import Aluno_Cadastrar_Atividade from "./pages/v_aluno/cadastro_horas/CadastrarAtividade";
import Aluno_Manter_Atividades from "./pages/v_aluno/manterAtividades/ManterAtividades";
import Aluno_Solicitar_Avaliacao from "./pages/v_aluno/solicitarAvaliacao/SolicitarAvaliacao";
import Aluno_Historico_Avaliacoes from "./pages/v_aluno/historicoAvaliacoes/HistoricoAvaliacoes";
import Aluno_Avaliacao_Selecionada from "./pages/v_aluno/historicoAvaliacoes/AvaliacaoSelecionada";
import Admin_Home from "./pages/v_admin/view_inicial/Home";
import Admin_Cadastrar_Versao from "./pages/v_admin/cadastrarVersao/CadastrarVersao";
import Admin_Manter_Alunos from "./pages/v_admin/manterAlunos/ManterAlunos";
import Admin_Aprovar_Alunos from "./pages/v_admin/aprovarAlunos/AprovarAlunos";
import Admin_Cadastrar_Avaliador from "./pages/v_admin/cadastroAvaliador/CadastroAvaliador";
import Admin_Manter_Avaliadores from "./pages/v_admin/manterAvaliadores/ManterAvaliadores";
import Admin_Homologar_Alunos from "./pages/v_admin/homologarEntrega/HomologarEntrega";
import Admin_Entregas_Homologadas from "./pages/v_admin/homologarEntrega/EntregasHomologadas";
import Avaliador_Home from "./pages/v_avaliador/view_inicial/Home";
import Avaliador_Avaliar_Atividades from "./pages/v_avaliador/avaliarAtividades/AvaliarAtividades";
import Avaliador_Avaliar_Atividade_Selecionada from "./pages/v_avaliador/avaliarAtividadeSelecionada/AvaliarAtividadeSelecionada";
import Avaliador_Historico_Avaliacoes from "./pages/v_avaliador/historicoAvaliacoes/HistoricoAvaliacoes";
import Avaliador_Avaliacao_selecionada from "./pages/v_avaliador/historicoAvaliacoes/AvaliacaoSelecionada";
import Avaliador_Perfil from "./pages/v_avaliador/perfil/Perfil";

//auth
import StoreProvider from './components/Store/Provider';
import PrivateRoute from "./components/Routes/Private/private";

export default function Routes() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/cadastro" component={Cadastro} />
                    <Route path="/recuperarSenha" component={RecuperarSenha} />
                    <PrivateRoute path="/alunoHome" component={Aluno_Home} user={"aluno"} />
                    <PrivateRoute path="/manterAtividades" component={Aluno_Manter_Atividades} user={"aluno"} />
                    <PrivateRoute path="/cadastrarAtividade" component={Aluno_Cadastrar_Atividade} user={"aluno"}/>
                    <PrivateRoute path="/adminHome" component={Admin_Home} user={"admin"}/>
                    <PrivateRoute path="/manterAlunos" component={Admin_Manter_Alunos} user={"admin"}/>
                    <PrivateRoute path="/aprovarAlunos" component={Admin_Aprovar_Alunos} user={"admin"}/>
                    <PrivateRoute path="/cadastroAvaliador" component={Admin_Cadastrar_Avaliador} user={"admin"}/>
                    <PrivateRoute path="/manterAvaliadores" component={Admin_Manter_Avaliadores} user={"admin"}/>
                    <PrivateRoute path="/avaliadorHome" component={Avaliador_Home} user={"avaliador"}/>
                    <PrivateRoute path="/cadastrarVersao" component={Admin_Cadastrar_Versao} user={"admin"}/>
                    <PrivateRoute path="/solicitarAvaliacao" component={Aluno_Solicitar_Avaliacao} user={"aluno"}/>
                    <PrivateRoute path="/avaliarAtividades" component={Avaliador_Avaliar_Atividades} user={"avaliador"}/>
                    <PrivateRoute path="/avaliarAtividadeSelecionada/:id" component={Avaliador_Avaliar_Atividade_Selecionada} user={"avaliador"}/>
                    <PrivateRoute path="/historicoAvaliacao" component={Aluno_Historico_Avaliacoes} user={"aluno"}/>
                    <PrivateRoute path="/avaliacaoSelecionada/:id" component={Aluno_Avaliacao_Selecionada} user={"aluno"}/>
                    <PrivateRoute path="/historicoAvaliacoes" component={Avaliador_Historico_Avaliacoes} user={"avaliador"}/>
                    <PrivateRoute path="/avaliadorAvaliacaoSelecionada/:id" component={Avaliador_Avaliacao_selecionada} user={"avaliador"}/>
                    <PrivateRoute path="/homologarEntrega" component={Admin_Homologar_Alunos} user={"admin"}/>
                    <PrivateRoute path="/entregasHomologadas" component={Admin_Entregas_Homologadas} user={"admin"}/>
                    <PrivateRoute path="/alunoPerfil" component={Aluno_Perfil} user={"aluno"}/>
                    <PrivateRoute path="/avaliadorPerfil" component={Avaliador_Perfil} user={"avaliador"}/>
                </Switch>
            </StoreProvider>
        </BrowserRouter>
    )
}