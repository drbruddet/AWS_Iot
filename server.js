import express from 'express';
import si from 'systeminformation';

const app = express();
const PORT = process.env.PORT || 3000;


// USE Lambda Functions Directly
import s3_lambdaFunctions from './AWS/s3_lambdaFunctions';
const lambdaStepFunction = new s3_lambdaFunctions();

// USE API with Lambda Functions
import s3_lambdaAPI from './AWS/s3_lambdaAPI';
const lambdaAPI = new s3_lambdaAPI({
    host: "o3hb8tbts0.execute-api.us-west-2.amazonaws.com",
    version: "dev",
    resource: "cpu-temperature"
});

// USER STEP FUNCTIONS
import s3_lambdaStepFunction from './AWS/s3_lambdaStepFunction';
const lambdaFunction = new s3_lambdaStepFunction();


async function cpuTemperature() {
    try { return await si.cpuTemperature(); }
    catch (e) { console.log(e); }
}

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    function executeLooping(i) {
        setTimeout(() => {
            cpuTemperature().then(data => {
                res.write(`temperature CPU-${i} : ${JSON.stringify(data)}<br/>`);
                //lambdaAPI.createData(data);
                //lambdaFunction.createData(data);
                lambdaFunction.callStepFunction({
                    functionARN: 'arn:aws:states:us-west-2:336369214233:stateMachine:checkTemperature',
                    input: data,
                    name: 'checkTemperature' + i
                });
            });
            executeLooping(++i);
        }, 3000)
    }
    executeLooping(0);
});

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
