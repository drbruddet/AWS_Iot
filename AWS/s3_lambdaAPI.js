import https from 'https';

class s3_lambdaAPI {

    constructor(params) {
        this.host     = params.host     || 'localhost';
        this.version  = params.version  || 'dev';
        this.resource = params.resource || 'default';
        const versionURL = this.version ? `/${this.version}` : '';
        this.path = `${versionURL}/${this.resource}`;
    }

    _getHTTPRequestOptions(requestType, header) {
        const defaultHeader = { 
            "content-type": "application/json",
            "accept": "application/json"
        }

        return {
            method: requestType,
            host: this.host,
            path: this.path,
            json: true,
            header : header || defaultHeader
        }
    }

    createData(data) {
        const options = this._getHTTPRequestOptions('POST');
        const req = https.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', body => {
              console.log(`---> POST :: ${body}`);
            });
        }).on('error', e => {
            console.log(`problem with request: ${e.message}`);
        })
        req.write(JSON.stringify(data));
        req.end();
    };

    listData() {
        const options = this._getHTTPRequestOptions('GET');
        const req = https.request(options, res => {
            res.on('data', body => {
                console.log(`---> GET :: ${body}`);
            });
        }).on('error', e => {
            console.log(`problem with request: ${e.message}`);
        });
        req.end();
    };

    deleteData(id) {
        const payload = JSON.stringify({"id": id});
        const header = { 
            "content-type": "application/json",
            "accept": "application/json",
            'Content-Length': Buffer.byteLength(payload)
        }
        const options = this._getHTTPRequestOptions('DELETE', header);
        const req = https.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', body => {
              console.log(`---> DELETE :: Body: ${body}`);
            });
        }).on('error', e => {
            console.log(`problem with request: ${e.message}`);
        })
        req.write(payload);
        req.end();
    };
}

export default s3_lambdaAPI;