import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Core() {
const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/mymodels/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div className="App">
            <h1>My Models</h1>
            <ul>
                {data.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Core;