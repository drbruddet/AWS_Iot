import AWS from 'aws-sdk';
AWS.config.update({region: 'us-west-2'});

class s3_lambdaStepFunction {

    constructor(apiVersion) {
        this.apiVersion = apiVersion | '2016-11-23';
        this.stepFunction = new AWS.StepFunctions({ apiVersion: this.apiVersion });
    }

    callStepFunction(params) {
        const execParams = { 
            stateMachineArn: params.functionARN, 
            input: JSON.stringify(params.input),
            name: params.name
        }

        this.stepFunction.startExecution(execParams, (err, data) => {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    };
}

export default s3_lambdaStepFunction;