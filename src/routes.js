import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

//pages import
import Login from "./pages/login/Login";
import Aluno_Home from "./pages/v_aluno/view_inicial/Home";
import Aluno_Cadastro from "./pages/cadastro/cadastro_aluno";
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

//auth
import StoreProvider from './components/Store/Provider';
import PrivateRoute from "./components/Routes/Private/private";

export default function Routes() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/cadastro" component={Aluno_Cadastro} />
                    <PrivateRoute path="/alunoHome" component={Aluno_Home} />
                    <PrivateRoute path="/manterAtividades" component={Aluno_Manter_Atividades} />
                    <PrivateRoute path="/cadastrarAtividade" component={Aluno_Cadastrar_Atividade} />
                    <PrivateRoute path="/adminHome" component={Admin_Home} />
                    <PrivateRoute path="/manterAlunos" component={Admin_Manter_Alunos} />
                    <PrivateRoute path="/aprovarAlunos" component={Admin_Aprovar_Alunos} />
                    <PrivateRoute path="/cadastroAvaliador" component={Admin_Cadastrar_Avaliador} />
                    <PrivateRoute path="/manterAvaliadores" component={Admin_Manter_Avaliadores} />
                    <PrivateRoute path="/avaliadorHome" component={Avaliador_Home} />
                    <PrivateRoute path="/cadastrarVersao" component={Admin_Cadastrar_Versao} />
                    <PrivateRoute path="/solicitarAvaliacao" component={Aluno_Solicitar_Avaliacao} />
                    <PrivateRoute path="/avaliarAtividades" component={Avaliador_Avaliar_Atividades} />
                    <PrivateRoute path="/avaliarAtividadeSelecionada/:id" component={Avaliador_Avaliar_Atividade_Selecionada} />
                    <PrivateRoute path="/historicoAvaliacao" component={Aluno_Historico_Avaliacoes} />
                    <PrivateRoute path="/avaliacaoSelecionada/:id" component={Aluno_Avaliacao_Selecionada} />
                    <PrivateRoute path="/historicoAvaliacoes" component={Avaliador_Historico_Avaliacoes} />
                    <PrivateRoute path="/avaliadorAvaliacaoSelecionada/:id" component={Avaliador_Avaliacao_selecionada} />
                    <PrivateRoute path="/homologarEntrega" component={Admin_Homologar_Alunos} />
                    <PrivateRoute path="/entregasHomologadas" component={Admin_Entregas_Homologadas} />
                    <PrivateRoute path="/alunoPerfil" component={Aluno_Perfil} />
                </Switch>
            </StoreProvider>
        </BrowserRouter>
    )
}