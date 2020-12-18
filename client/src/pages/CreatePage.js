import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { useHttp } from '../hooks/http.hook';
import { useHistory } from 'react-router-dom';

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [link, setLink] = useState('');

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const pressHandler = async evt => {
        if (evt.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${auth.token}`
                });
                history.push(`/detail/${data.link._id}`);
            } catch (e) {

            }
        }
    };

    return (
        <div className="row">
            <div className="col s8 offset-s2"   style={{paddingTop: '2rem'}}>
            <input 
                placeholder="Вставьте ссылку" 
                id="link" 
                type="text" 
                name="link"
                className="yellow-input"
                onChange={e => setLink(e.target.value)}
                onKeyPress={pressHandler}
            />
            <label htmlFor="link">Password</label>
            </div>
        </div>    
    );
}