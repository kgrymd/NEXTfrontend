import React from 'react'

const DetailBadge = ({ label, from, to, unit }) => {
    return (
        <>
            {from && to ?
                <p>{label}: {from} ~ {to}{unit}</p>
                : from ?
                    <p>{label}: {from}{unit} ~ </p>
                    : to ?
                        <p>{label}:  ~ {to}{unit}</p>
                        : null
            }
        </>
    )
}

export default DetailBadge