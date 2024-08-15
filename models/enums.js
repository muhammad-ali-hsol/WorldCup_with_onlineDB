const orderStatus=Object.freeze({
    1:'active',
    2:'inactive',
});

const orderTrackingStatus=Object.freeze({
    1:'pending',
    2:'processing',
    3:'shipped',
    4:'cancelled',
});

module.exports={orderStatus,orderTrackingStatus}

