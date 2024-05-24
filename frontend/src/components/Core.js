import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Core() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/api/categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    return (
        <div className="App">
            <h1>Categories</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Core;