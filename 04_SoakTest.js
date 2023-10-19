import http from "k6/http";
import { check } from 'k6';

export let options = {
    
    thresholds : {
        //errors: ['rate<0.1'],
        http_req_duration: ['avg<1000', 'p(99)<1500'], // average of requests must complete below 1 sec and // 99% of requests must complete below 1.5s
        http_req_failed:['rate<0.1']
    },

    stages: [
        { duration: '2m', target: 200 }, // ramp up to 200 users
        { duration: '1h', target: 400 }, // stay at 400 for ~1 hours
        { duration: '2m', target: 0 }, // scale down. 
      ],
}

const BASE_URL = 'https://www.propertyfinder.bh';

export default function(){
    let response = http.get(BASE_URL)

    // console.log(`responce body length ${response.body.length}`)

    const check1 = check(response, {
        'is responce status is 200 :' : (r)=> r.status === 200
    })
    
    errorRate.add(!check1);

    const check2 = check(response, {
    'is responce length 230351 byte:' : (r) => r.body.length == 230351
    })

    errorRate.add(!check2);

}