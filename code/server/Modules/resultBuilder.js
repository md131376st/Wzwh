class ResultBuilder{
    static sendResult(resIn, resOut){
        if (resIn.status === 200 || resIn.status === 201 || resIn.status === 204)
            resOut.status(resIn.status).json(resIn.result);
        else
            resOut.status(resIn.status).json(resIn.error);
    }
}

module.exports = ResultBuilder;