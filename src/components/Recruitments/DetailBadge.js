import React from 'react'

const DetailBadge = ({ label, from, to, unit }) => {
    return (
        <>
            {from && to ?
                <p>募集{label}: {from} ~ {to}{unit}</p>
                : from ?
                    <p>募集{label}: {from}{unit} ~ </p>
                    : to ?
                        <p>募集{label}:  ~ {to}{unit}</p>
                        : null
            }
        </>
    )
}

export default DetailBadge