import React from 'react';
import './Index.css';
import imgInit from '../../Assets/Login.jpg'

export default function Index(){

    return(
        <div className="container-index">
            <section className="section-index">
            <img alt="img" src={imgInit}></img>
            </section>
        </div>
    )
}