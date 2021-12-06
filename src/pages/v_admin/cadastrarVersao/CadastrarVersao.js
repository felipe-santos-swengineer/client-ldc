import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NavBar from '../NavBar';
import TextField from '@material-ui/core/TextField';
import Copyright from "../../../components/copyright/Copyright";
import Portas from "../../../portas";


//modal
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';


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
        flexDirection: "row"
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const { token } = useContext(StoreContext);

    //Categoria Vars
    const [value, setValue] = React.useState(0);
    const [tempCategoria, setTempCategoria] = useState("");
    const [editarCategoria, setEditarCategoria] = useState(false);
    const [versao, setVersao] = useState("");
    const [categorias, setCategorias] = React.useState([]);

    //Subcategoria Vars
    const [editarSubCategoria, setEditarSubCategoria] = useState(false);
    const [tempSubCategoria, setTempSubCategoria] = useState("");
    const [subCategorias, setSubCategorias] = React.useState([]);

    //Salvar alterações
    const [salvarAlteracoes, setSalvarAlteracoes] = useState(false);

    const handleCloseSA = () => setSalvarAlteracoes(false);

    const handleShowSA = () => {
        setSalvarAlteracoes(true);
    }

    const putVersao = async (vNome, vHoras) => {
        try {
            setVersao({ "nome": vNome, "horas": vHoras });
            const body = { categorias, subCategorias, token, vNome, vHoras };
            const response = await fetch(Portas().serverHost + "/adicionarVersao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            alert(resJSON);
            handleCloseSA();
            //window.location = "/manterAtividades";

        } catch (err) {
            console.log(err.message);
        }
    }

    const getVersao = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/versao/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();

            if(resJSON.length === 0){
                return;
            }

            setCategorias(resJSON[0]);
            setSubCategorias(resJSON[1]);
            setVersao(resJSON[2]);

        } catch (err) {
            alert(err);
        }
    }

    //CRUD CATEGORIAS

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCloseEC = () => setEditarCategoria(false);

    const handleShowEC = () => {
        setTempCategoria(categorias[value]);
        setEditarCategoria(true);
    }

    const adicionarCategoria = () => {
        var nome = "nova categoria";
        var id = categorias.length + 1;
        var horas = 0;

        setSubCategorias(subCategorias => [...subCategorias, { id_categoria: id, id: 1, nome: "nova subCategoria" }]);
        setCategorias(categorias => [...categorias, { id: id, nome: nome, horas: horas }]);


    }

    const editCategoria = (nome, quantHoras) => {
        if (categorias.length < 1) {
            return;
        }

        if (nome === "" || quantHoras < 1) {
            alert("Há campos invalidos");
            return;
        }

        let newArr = [...categorias];
        newArr[value].nome = nome;
        newArr[value].horas = quantHoras;
        setCategorias(newArr);
        handleCloseEC();
    }

    const removerCategoria = () => {

        if (categorias.length <= 1) {
            alert("Não é possivel remover")
            return;
        }

        var newCatArray = categorias.filter(item => (item.id !== categorias[value].id));
        var newSubArray = subCategorias.filter(item => (item.id_categoria !== categorias[value].id));

        for (var i = 0; i < newCatArray.length; i++) {
            if (newCatArray[i].id > categorias[value].id) {
                newCatArray[i].id--;;
            }
        }

        for (var j = 0; j < newSubArray.length; j++) {
            if (newSubArray[j].id_categoria > categorias[value].id) {
                newSubArray[j].id_categoria--;;
            }
        }

        setValue(0);
        setSubCategorias(newSubArray);
        setCategorias(newCatArray);

    }

    //CRUD SUBCATEGORIAS

    const handleCloseESC = () => setEditarSubCategoria(false);

    const handleShowESC = (item) => {
        setTempSubCategoria(item);
        setEditarSubCategoria(true);
    }

    const adicionarSubCategoria = () => {

        if (categorias.length < 1) {
            return;
        }

        var nome = "nova subCategoria";
        var categoria = categorias[value];
        var contador = 1;

        if (subCategorias.length === 0) {
            setSubCategorias(subCategorias => [...subCategorias, { id_categoria: categoria.id, id: contador, nome: nome }]);
            return;
        }

        for (var i = 0; i < subCategorias.length; i++) {
            if (categoria.id === subCategorias[i].id_categoria) {
                if (contador <= subCategorias[i].id) {
                    contador = subCategorias[i].id + 1;
                }
            }
        }

        setSubCategorias(subCategorias => [...subCategorias, { id_categoria: categoria.id, id: contador, nome: nome }]);
    }

    function editSubCategoria(novoNome) {

        if (novoNome === "") {
            alert("Nome inválido");
            return;
        }
        let newArr = [...subCategorias];

        for (var i = 0; i < subCategorias.length; i++) {
            if (subCategorias[i].id_categoria === tempSubCategoria.id_categoria && subCategorias[i].id === tempSubCategoria.id) {
                newArr[i].nome = novoNome;
            }
        }

        setSubCategorias(newArr);
        handleCloseESC();
    }

    function removerSubCategoria(item) {

        let newArr = [...subCategorias];

        var cont = 0;

        for (var i = 0; i < subCategorias.length; i++) {
            if (subCategorias[i].id_categoria === item.id_categoria) {
                cont++;
            }
        }

        if (cont <= 1) {
            alert("Não pode deixar categorias sem subcategoria");
            return;
        }

        for (var k = 0; k < subCategorias.length; k++) {
            if (subCategorias[k].id_categoria === item.id_categoria && subCategorias[k].id === item.id) {
                newArr.splice(k, 1);
            }
        }

        for (var j = 0; j < newArr.length; j++) {
            if (newArr[j].id_categoria === item.id_categoria && newArr[j].id > item.id) {
                newArr[j].id = newArr[j].id - 1;
            }
        }

        setSubCategorias(newArr);
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

    useEffect(() => {
        getVersao();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <NavBar></NavBar>
            <Modal show={editarSubCategoria} onHide={handleCloseESC}>
                <Modal.Header closeButton>
                    <Modal.Title>Editando SubCategoria: {tempSubCategoria.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nomeSubCategoria"
                        label="Novo Nome"
                        inputProps={{ maxLength: 199 }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseESC}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => editSubCategoria(document.getElementById("nomeSubCategoria").value)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={editarCategoria} onHide={handleCloseEC}>
                <Modal.Header closeButton>
                    <Modal.Title>Editando Categoria: {tempCategoria.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nomeCategoria"
                        label="Novo Nome"
                        inputProps={{ maxLength: 199 }}
                    />
                    <TextField
                        style={{ marginBottom: "5px", marginTop: "5px" }}
                        id="quantHoras"
                        label="Quantidade de Horas*"
                        type="number"
                        defaultValue={1}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEC}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => editCategoria(document.getElementById("nomeCategoria").value, document.getElementById("quantHoras").value)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={salvarAlteracoes} onHide={handleCloseSA}>
                <Modal.Header closeButton>
                    <Modal.Title>Finalizar edição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nomeVersao"
                        label="Identificador da Versão"
                        placeholder="2021.1"
                        inputProps={{ maxLength: 199 }}
                    />
                    <TextField
                        style={{ marginBottom: "5px", marginTop: "5px" }}
                        id="quantHoras"
                        label="Horas necessárias"
                        required
                        type="number"
                        defaultValue={1}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSA}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => putVersao(document.getElementById("nomeVersao").value, document.getElementById("quantHoras").value)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{ marginBottom: "5px", display: "flex", justifyItems: "center", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                <button
                    style={{ marginLeft: "3px", backgroundColor: "#4B0082", border: "none" }}
                    className="btn btn-success"
                    onClick={() => adicionarCategoria()}
                >
                    Adicionar Categoria
                </button>
                <button
                    style={{ marginLeft: "3px", backgroundColor: "blue", border: "none" }}
                    className="btn btn-danger"
                    onClick={() => removerCategoria()}
                >
                    Remover Categoria
                </button>
                <button
                    style={{ marginLeft: "3px", backgroundColor: "#4B0082", border: "none" }}
                    className="btn btn-danger"
                    onClick={handleShowEC}
                >
                    Editar Categoria
                </button>
                <button
                    style={{ marginLeft: "3px", backgroundColor: "blue", border: "none" }}
                    className="btn btn-danger"
                    onClick={() => adicionarSubCategoria()}
                >
                    Adicionar SubCategoria
                </button>
            </div>
            <div className={classes.root} style={{ justifyContent: "center", paddingBottom: "5px", borderBottom: "1px solid" }}>
                <div>
                    <h3>Versão: {versao.nome} / {versao.horas}H</h3>
                </div>
            </div>
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
                        {subCategorias.map((item) => (item.id_categoria === index + 1 ?
                            <div style={{ display: "flex", marginTop: "1vw" }}>
                                {romanize(item.id) + "-" + item.nome}
                                <button style={{ marginLeft: "1vw", color: "blue" }} onClick={() => handleShowESC(item)}>Editar</button>
                                <button style={{ marginLeft: "1vw", color: "red" }} onClick={() => removerSubCategoria(item)}>Remover</button>
                            </div> : <div></div>))}
                    </TabPanel>))}

            </div>
            <div style={{ marginTop: "5px", marginBottom: "5px", display: "flex", justifyItems: "center", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                <button
                    style={{ backgroundColor: "green", border: "none", }}
                    className="btn btn-danger"
                    onClick={handleShowSA}
                >
                    Atualizar Versão
                </button>
                <button
                    style={{ backgroundColor: "red", border: "none", marginLeft: "3px" }}
                    className="btn btn-danger"
                    onClick={() => { window.location = "/cadastrarVersao" }}
                >
                    Cancelar Alterações
                </button>
            </div>
            <Copyright></Copyright>
        </div >
    );
}