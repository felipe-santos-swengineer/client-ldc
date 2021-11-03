import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NavBar from '../NavBar';
import TextField from '@material-ui/core/TextField';
import { CategoryOutlined } from '@material-ui/icons';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [categorias, setCategorias] = React.useState([
        { id: 1, nome: "Atividades de iniciação à docência", horas: 96 },
        { id: 2, nome: "Atividades de iniciação à pesquisa", horas: 96 },
        { id: 3, nome: "Atividades de extensão", horas: 96 },
    ]);
    const [subCategorias, setSubCategorias] = React.useState([
        { categoria: 1, id: 1, nome: "Atividades de iniciação à docência;" },
        { categoria: 2, id: 1, nome: "Atividades de iniciação à pesquisa" },
        { categoria: 3, id: 1, nome: "Atividades de extensão" },
        { categoria: 3, id: 2, nome: "Atividades de iniciação à docência;" },
        { categoria: 2, id: 2, nome: "Atividades de iniciação à pesquisa" },
        { categoria: 1, id: 2, nome: "Atividades de extensão" },
    ]);

    const handleChange = (event, newValue) => {
        //alert(newValue);
        setValue(newValue);
    };

    const adicionarCategoria = () => {
        var nome = "nova" + categorias.length;
        var id = categorias.length + 1;
        var horas = 10;
        setCategorias(categorias => [...categorias, { id: id, nome: nome, horas: horas }]);
    }

    const removerCategoria = () => {
        var newCatArray = categorias.filter(item => (item.id != categorias[value].id));
        var newSubArray = subCategorias.filter(item => (item.categoria != categorias[value].id));

        for (var i = 0; i < newCatArray.length; i++) {
            if (newCatArray[i].id > categorias[value].id) {
                newCatArray[i].id--;;
            }
        }

        for (var i = 0; i < newSubArray.length; i++) {
            if (newSubArray[i].categoria > categorias[value].id) {
                newSubArray[i].categoria--;;
            }
        }

        setSubCategorias(newSubArray);
        setCategorias(newCatArray);
    }

    const editarCategoria = () => {
        if (categorias.length < 1) {
            return;
        }
        let newArr = [...categorias];
        newArr[value].nome = "nome Novo";
        setCategorias(newArr);
    }

    const adicionarSubCategoria = () => {

        if (categorias.length < 1) {
            return;
        }

        var nome = "nova categoria";
        var categoria = categorias[value];
        var contador = 1;

        if (subCategorias.length === 0) {
            setSubCategorias(subCategorias => [...subCategorias, { categoria: categoria.id, id: contador, nome: nome }]);
            return;
        }

        for (var i = 0; i < subCategorias.length; i++) {
            if (categoria.id === subCategorias[i].categoria) {
                if (contador <= subCategorias[i].id) {
                    contador = subCategorias[i].id + 1;
                }
            }
        }

        setSubCategorias(subCategorias => [...subCategorias, { categoria: categoria.id, id: contador, nome: nome }]);
    }

    function romanize(num) {
        var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
        for (i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    }

    return (
        <div>
            <NavBar></NavBar>
            <div style={{ display: "flex" }}>
                <div style={{ width: "25%" }}></div>
                <div style={{ backgroundColor: "white", display: "grid", width: "50%" }}>
                    <TextField
                        style={{ marginTop: "5px" }}
                        id="titulo"
                        label="Nome*"
                        type="search"
                        variant="outlined"
                        inputProps={{ maxLength: 199 }}
                    />
                    <TextField
                        style={{ marginBottom: "5px", marginTop: "5px" }}
                        id="quantHoras"
                        label="Quantidade de Horas*"
                        type="number"
                        defaultValue={0}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                        }}
                    />
                </div>
                <div style={{ width: "25%" }}></div>
            </div>
            <button
                style={{ backgroundColor: "#4B0082", border: "none" }}
                className="btn btn-success"
                onClick={() => adicionarCategoria()}
            >
                Adicionar Categoria
            </button>
            <button
                style={{ backgroundColor: "blue", border: "none" }}
                className="btn btn-danger"
                onClick={() => removerCategoria()}
            >
                Remover Categoria
            </button>
            <button
                style={{ backgroundColor: "#4B0082", border: "none" }}
                className="btn btn-danger"
                onClick={() => editarCategoria()}
            >
                Editar Categoria
            </button>
            <button
                style={{ backgroundColor: "blue", border: "none" }}
                className="btn btn-danger"
                onClick={() => adicionarSubCategoria()}
            >
                Adicionar SubCategoria
            </button>
            <div className={classes.root}>

                <Tabs
                    orientation="vertical"

                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    {categorias.map((item, index) => (<Tab label={romanize(item.id) + "-" + item.nome + " (" + item.horas + "H)"} {...a11yProps(index)} />))}
                </Tabs>
                {categorias.map((item, index) => (
                    <TabPanel value={value} index={index}>
                        {subCategorias.map((item) => (item.categoria === index + 1 ?
                            <div style={{ display: "flex" }}>
                                {romanize(item.id) + "-" + item.nome}
                            </div> : <div></div>))}
                    </TabPanel>))}
            </div>
        </div >
    );
}