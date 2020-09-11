import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxHeight: 500,
    marginTop: 100,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
});

const usuario = localStorage.getItem('@usuarioHD')

export default function Cards({lista, chamadoFinalizado, chamadoAberto}) {

  const classes = useStyles();
  return (
    <Card className={classes.root} variant="elevation">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Dados usuário:
        </Typography>
        <Typography variant="h5" component="h2">
          {usuario}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Chamados em aberto:
        </Typography>
        <Typography variant="h6" component="h2">
        {chamadoAberto}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Chamados encerrados:
        </Typography>
        <Typography variant="h6" component="h2">
        {chamadoFinalizado}
        </Typography>
      </CardContent>
    </Card>
  );
}