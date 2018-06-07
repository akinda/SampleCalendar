//#region wrapper helpers

exports.wrapDataSuccess = (myData, message = "") => {
    console.log("In get wrap data...");

    //check if data is null
    if(myData === null){
        return getEmptyResult(message);
    }

    if(myData.constructor === Array){

        //wrap data array
        let mappedData = myData.map(element => {
            return {                
                id: element["$loki"],
                date: element.date,                    
                message: element.message                
            }
        });

        return {
            data: mappedData,
            message: message,
            isSuccess: true
        };
        

        

    } else {

        //wrap data object
        return {
            data: {
                id: myData["$loki"],
                date: myData.date,                
                message: myData.message
            },
            message: message,
            isSuccess: true
        }
    }    
}

exports.wrapDataFailure = (myData, message = "") => {

    //check if data is null
    if(myData === null){
        return getEmptyResult(message);
    }

    if(myData.constructor === Array){

        //wrap data array
        let mappedData = myData.map(element => {
            return {                
                id: element["$loki"],
                date: element.date,                    
                message: element.message                
            }
        });

        return {
            data: mappedData,
            message: message,
            isSuccess: false
        };

    } else {
        //wrap data object
        return {
            data: {
                id: myData["$loki"],
                date: myData.date,
                // startTime: myData.startTime,
                // endTime: myData.endTime,
                message: myData.message
            },
            message: message,
            isSuccess: true
        }
    }
}

let getEmptyResult = (message = "Error occurred") => {
    return {
        data: null,
        message: message,
        isSuccess: false
    }
}
exports.getEmptyResult = getEmptyResult;
//#endregion