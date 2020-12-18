import React from 'react';

export const LinkCard = ({link}) => {
    return (<>
    <h2>Ссылка</h2>
    <p>Вафша ссылка <a href ={link.to} target="_blank" rel="noreferrer noopener">{link.to}</a></p>
    <p>Откуда <a href ={link.from} target="_blank" rel="noreferrer noopener">{link.from}</a></p>
    <p>Кол-во кликов <strong>{link.clicks}</strong></p>
    <p>Дата создания {new Date(link.date).toLocaleDateString()}</p>
    </>
    )
};
