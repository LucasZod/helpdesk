import React, { useEffect } from 'react';
import { FormGroup } from '@material-ui/core';
import './Cadastro.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {getSolicitacoes, postSolicitacoes, liberacoesButtons} from '../../Requests/api';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'nomesolicitacao', numeric: false, disablePadding: false, label: 'Nome Solicitação' },
    { id: 'observacao', numeric: true, disablePadding: false, label: 'Observação' },
    { id: 'dt_created ', numeric: true, disablePadding: false, label: 'Criado em' },
    { id: 'dt_updated', numeric: true, disablePadding: false, label: 'Atualizado em' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();

    return (
        <Toolbar>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                 Solicitações
            </Typography>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        marginBottom: theme.spacing(1),

        
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));


export default function Cadastro() {

    const idUser = parseInt(localStorage.getItem('@idHD'));
    if(!idUser) { window.location.pathname = '/'}
    
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dados, setDados] = React.useState({nomesolicitacao: '', observacao: ''})
    const [rows, setRows] = React.useState([])
    const [modulo, setModulo] = React.useState([])

    useEffect(()=>{
        const getModules = async () =>{
            const modules = await liberacoesButtons();
            const objMod = {}
            console.log(modules);
            modules.map((module)=>{
                return objMod[module.nome_botao] = module.excluido
            })
            setModulo(objMod);
        }
        getModules();
    },[setModulo])

    const Cad = modulo['Cadastro de solicitações'];
    if(Cad === 1) { window.location.pathname = '/index'}

    useEffect(()=>{
        const callApi = async () =>{
            const {data:{resultadoFinal}} = await getSolicitacoes();
            setRows(resultadoFinal);
        }
        callApi();
    },[setRows])


   
    
    const handlerCad = async() =>{
        if(Cad === 1){
            alert('Você não tem permissão para esse módulo')
            return;
        }

        if(!dados.nomesolicitacao || !dados.observacao){
            if(!dados.nomesolicitacao){
                alert('Não há solicitação');
            }
            if(!dados.observacao){
                alert('Não há observações');
            }
            return;
        }
        
        else{
            await postSolicitacoes(dados);
            setRows([...rows, dados])
            window.location.reload()
            
        }  
    }

    // const handlerRemove = async (id) =>{
    //     const newVetor = rows.filter((row)=>{
    //         return row.id !== id;
    //     })
    //     setRows(newVetor)
    //     const dados = {excluido: 1, id}

    //     await pathSolicitacoes(dados)

    // }

   

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className="container-solicitacao">
            <Paper className={classes.paper} elevation={6}>
                <FormGroup className="formGroup">
                    <p>Solicitação</p>
                    <TextField
                        className="formField"
                     
                        placeholder="Nome"
                        onChange = {e => setDados({...dados, nomesolicitacao: e.target.value})}
                        name = "nomesolicitacao"
                    />
                    <p>Observação</p>
                    <TextField
                        className="formField"
                        placeholder="Observação"
                        onChange = {e => setDados({...dados, observacao: e.target.value})}
                        name = "observacao"
                    />
                    <Button color="primary" onClick={handlerCad}>Cadastrar</Button>

                </FormGroup>
            </Paper>
            <aside className="formAside">
                <div className={classes.root}>
                    <Paper className={classes.paper} elevation={4}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <TableContainer>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}     
                                                >

                                                    <TableCell component="th" id={labelId} scope="row" >
                                                        {row.nomesolicitacao}
                                                    </TableCell>
                                                    <TableCell align="right">{row.observacao}</TableCell>
                                                    <TableCell align="right">{row.dt_created}</TableCell>
                                                    <TableCell align="right">{row.dt_updated}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </aside>
        </div>
    )
}