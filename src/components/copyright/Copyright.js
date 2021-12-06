import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
    return (
        <Box pt={4}>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Direitos reservados ©'}
                {'Projeto Linha de Chegada '}
                
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    );
}