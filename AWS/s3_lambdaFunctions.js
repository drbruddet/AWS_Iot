import AWS from 'aws-sdk';
AWS.config.update({region: 'us-west-2'});

class s3_lambdaFunctions {

    constructor(apiVersion) {
        this.apiVersion = apiVersion | '2015-03-31';
        this.lambda = new AWS.Lambda({ apiVersion: this.apiVersion });
    }

    _getDefaultparams(functionName, payLoad) {
        return {
            FunctionName: functionName,
            InvocationType : 'RequestResponse',
            LogType : 'None',
            Payload : payLoad ? JSON.stringify(payLoad) : ''
        }
    };

    createData(input) {
        const params = this._getDefaultparams('createTemperatureData', input);
        this.lambda.invoke(params, (err, data) => {
            err ? console.log(err) : console.log(JSON.parse(data.Payload));
        });
    };

    listData(){
        const params = this._getDefaultparams('listTemperatureData');
        this.lambda.invoke(params, (err, data) => {
            err ? console.log(err) : console.log(JSON.parse(data.Payload));
        });
    };

    deleteData(id) {
        const params = this._getDefaultparams('deleteTemperatureData', { 'id': id });
        this.lambda.invoke(params, (err, data) => {
            err ? console.log(err) : console.log(JSON.parse(data.Payload));
        });
    };

}

export default s3_lambdaFunctions;