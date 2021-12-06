import NavBar from "../NavBar";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/icons/AssignmentTurnedIn';
import Portas from "../../../portas";


//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
        },
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
    }, paper: {
        marginLeft: "10px",
        marginRight: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
        overflowX: "auto",
    },
}));

export default function SolicitarAvaliacao() {
    const classes = useStyles();
    const { token } = useContext(StoreContext);

    const solicitar = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/alunos/bytoken/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            if (resJSON.status_entrega === "Em Homologação") {
                alert("Não pode solicitaçar avaliação durante homologação")
                return;
            }

            if (resJSON.status_entrega === "Atividades entregues") {
                alert("Atividades já foram entregues")
                return;
            }

            try {
                //verificar se o aluno tem atividades cadastradas
                const response = await fetch(Portas().serverHost + "/atividades/" + token,
                    {
                        method: "GET",
                    }
                );
                var resJSON1 = await response.json();

                if (resJSON1.length < 1) {
                    alert("Não há atividades cadastradas!");
                    return;
                }


                try {
                    //verificar disponibilidade de avaliador
                    const response = await fetch(Portas().serverHost + "/solicitacao/" + token,
                        {
                            method: "GET",
                        }
                    );
                    var resJSON2 = await response.json();
                    alert(resJSON2);
                    window.location = "/historicoAvaliacao";
                    return;


                } catch (err) {
                    alert("Um erro ocorreu");
                    return;
                }
            } catch (err) {
                alert(err);
            }
        } catch (err) {
            alert(err);
        }

    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <h1 style={{ color: "blue" }}>Solicitar Avaliação</h1>
                    <p>
                        Ao solicitar uma avaliação, um membro do colegiado receberá todas as suas atividades cadastradas
                        no momento.
                    </p>
                    <p>
                        Ele(a) valiará cada uma e anexará um feedback se necessário.
                    </p>
                    <p>
                        Certifique-se de que a informação não está incorreta e/ou desatualizada!
                    </p>
                    <p style={{ color: "orange" }}>
                        Você poderá solicitar múltiplas avaliações (Uma de cada vez), portanto tente reunir o máximo de atividades possivel antes de solicitar uma nova,
                        pois demandará tempo para ser respondido.
                    </p>
                    <p style={{ color: "red" }}>
                        Submissão com conteúdo inaprópriado ou fora do contexto poderá acarretar na suspensão da sua conta.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            endIcon={<Icon></Icon>}
                            onClick={solicitar}
                        >
                            Solicitar Avaliação
                        </Button>
                    </div>
                </Paper>
            </div>

        </div>

    )
}