import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import NavBar from "../NavBar";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import image from './images/pergamum.jpg';
import image1 from "./images/flexibilizacao.jpg";
import Paper from '@material-ui/core/Paper';
import { Chart } from "react-google-charts";
import Portas from "../../../portas";
import Copyright from "../../copyright/Copyright";


//auth
import StoreContext from '../../../components/Store/Context';
import { useContext } from 'react';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: "20px",
        marginLeft: "20px",
        marginRight: "20px",
    },
    paper: {
        marginTop: "20px",
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom: "20px",
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        backgroundColor: theme.palette.background.paper,
    },
    imageListHorizontal: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));

export default function Home() {
    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const [options, setOptions] = useState();
    const [optionsBar, setOptionsBar] = useState();
    const [data, setData] = useState([]);
    const [dataTotal, setDataTotal] = useState(

    );
    const [optionsTotal, setOptionsTotal] = useState();
    const [dataBar, setDataBar] = useState([])
    const itemData = [
        {
            img: image,
            title: 'Image1',
            author: 'author',
        },
        {
            img: image1,
            title: 'Image2',
            author: 'author',
        },
        {
            img: image,
            title: 'Image3',
            author: 'author',
        },
        {
            img: image1,
            title: 'Image4',
            author: 'author',
        },
        {
            img: image,
            title: 'Image5',
            author: 'author',
        },
        {
            img: image1,
            title: 'Image6',
            author: 'author',
        },
    ];

    const somarAtividades = (resJSON) => {
        //somar atividades
        var i_ = 0;
        var ii_ = 0;
        var iii_ = 0;
        var iv_ = 0;
        var v_ = 0;
        var vi_ = 0;
        var vii_ = 0;
        console.log(i_ + " " + ii_ + " " + iii_ + " " + iv_ + " " + v_ + " " + vi_ + " " + vii_)
        console.log(resJSON);
        for (var j = 0; j < resJSON.length; j++) {
            switch (resJSON[j].categoria) {
                case 'I':
                    i_ = i_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'II':
                    ii_ = ii_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'III':
                    iii_ = iii_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'IV':
                    iv_ = iv_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'V':
                    v_ = v_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'VI':
                    vi_ = vi_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                case 'VII':
                    vii_ = vii_ + parseFloat(resJSON[j].quantidade_horas);
                    break;
                default:
                    console.log("Algo inesperado ocorreu");
            }
        }

        console.log(i_ + " " + ii_ + " " + iii_ + " " + iv_ + " " + v_ + " " + vi_ + " " + vii_);
        //tratar excessoes

        if (i_ > 96) {
            i_ = 96;
        }
        if (ii_ > 64) {
            ii_ = 64;
        }
        if (iii_ > 32) {
            iii_ = 32;
        }
        if (iv_ > 64) {
            iv_ = 64;
        }
        if (v_ > 96) {
            v_ = 96;
        }
        if (vi_ > 48) {
            vi_ = 48;
        }
        if (vii_ > 48) {
            vii_ = 48;
        }

        setOptions({
            title: 'Proporção das horas Cadastradas por critério'
        });

        setOptionsTotal({
            title: 'Progresso Total para Engenharia de Software'
        });

        setOptionsBar({
            title: 'Progresso por categorias para Engenharia de Software'
        });

        setDataTotal(
            [
                ['Categorias', 'Horas Cadastradas', 'Horas necessárias para o curso'],
                ['Contador de Horas', i_ + ii_ + iii_ + iv_ + v_ + vi_ + vii_, 288],
            ]
        )
        if (i_ === 0 && ii_ === 0 && iii_ === 0 && iv_ === 0 && v_ === 0 && vi_ === 0 && vii_ === 0) {
            setData(
                [
                    ['A', 'Horas inseridas'],
                    ['Nenhuma Atividade Inserida', 1],

                ]
            )
        }
        else {
            setData(
                [
                    ['A', 'Horas inseridas'],
                    ['I', i_],
                    ['II', ii_],
                    ['III', iii_],
                    ['IV', iv_],
                    ['V', v_],
                    ['VI', vi_],
                    ['VII', vii_],
                ]
            )
        }

        setDataBar(
            [
                ['Categorias', 'Horas Cadastradas', 'Limite da categoria'],
                ['Categoria I', i_, 96],
                ['Categoria II', ii_, 64],
                ['Categoria III', iii_, 32],
                ['Categoria IV', iv_, 64],
                ['Categoria V', v_, 96],
                ['Categoria VI', vi_, 48],
                ['Categoria VII', vii_, 48],
            ]
        )
    }

    //pegar registros de atividades
    const getAtividades = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/atividades/" + token,
                {
                    method: "GET",
                }
            );
            var resJSON = await response.json();
            somarAtividades(resJSON);

        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getAtividades();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.root}>
                <ImageList className={classes.imageListHorizontal} cols={2.5}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                            <img src={item.img} alt={item.title} />
                            <ImageListItemBar
                                title={item.title}
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title,
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <Paper elevation={12} style={{ textAlign: "center", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
                <h1>Resumo das suas Atividades</h1>
                <div style={{ display: "flex", overflowY: "scroll", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="PieChart"
                        data={data}
                        options={options}
                    />
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="BarChart"
                        data={dataBar}
                        options={optionsBar}
                    />
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="BarChart"
                        data={dataTotal}
                        options={optionsTotal}
                    />
                </div>
            </Paper>
            <Copyright></Copyright>
        </div>
    )
}