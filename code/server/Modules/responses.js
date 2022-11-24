class Response{

    static 200(res){
        return { status: 200, result:res };
    }

    static 201(){
        return { status: 201 };
    }

    static 204(){
        return { status: 204 };
    }

    static 401(){
        return { status: 401, error: `Unauthorized`};
    }

    static 404(e){
        return { status: 404, error: `Not found. ${e ? e : ""}` };
    }

    static 409(e){
        return { status: 409, error: `Conflict. ${e ? e : ""}` };
    }
    
    static 422(e){
        return { status: 422, error: `Unprocessable entity. ${e ? e : ""}` };
    }

    static 500(e){
        return { status: 500, error: `Internal server error. ${e ? e : ""}` };
    }

    static 503(e){
        return { status: 503, error: `Service Unavailable. ${e ? e : ""}` };
    }
}

module.exports = Response;