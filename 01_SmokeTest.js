import http from 'k6/http';

import { check } from 'k6';

import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {

    vus:1,
    duration: '10s', // 1 user looping for 1 minute
    
    thresholds : {
        errors: ['rate<0.1'],
        http_req_duration: ['avg<1000'], // average of requests must complete below 1 sec
        http_req_failed:['rate<0.1']
    },
}

const BASE_URL = 'https://www.propertyfinder.bh';

export default function(){
    let response = http.get(BASE_URL)

    let body = JSON.parse(response.body)

    //console.log(`responce body length: ${response.body.length}`)

    const check1 = check(response, {
            'is responce status is 200 :' : (r)=> r.status === 200
        })
        
    errorRate.add(!check1);

    const check2 = check(response, {
        'is responce length 230351 byte:' : (r) => r.body.length == 230351
    })
    errorRate.add(!check2);
}