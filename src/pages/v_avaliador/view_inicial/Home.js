import NavBar from "../NavBar";
import Copyright from "../../copyright/Copyright";
import Paper from '@material-ui/core/Paper';

export default function Home() {
    return (
        <div>
            <NavBar></NavBar>
            <Paper elevation={12} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center',overflow: 'hidden',}}>
                <h1>Welcome Avaliador</h1>
            </Paper>
            <Copyright></Copyright>
        </div>
    )
}