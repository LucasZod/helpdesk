import React from 'react';

export default function Cards({chamado}){
    return(
        <>
            <h4>{chamado.id}</h4>
            <h5>{chamado.usuario}</h5>
            <h5>{chamado.email}</h5>
        </>
    )
}