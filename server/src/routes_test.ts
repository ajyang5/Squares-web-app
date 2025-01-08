import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy, save, load, names, resetFilesForTesting } from './routes';


describe('routes', function() {

  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function() {
    // You can copy this test structure to start your own tests, these comments
    // are included as a reminder of how testing routes works:

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Zach'}}); 
    const res1 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    dummy(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(res1._getData(), {greeting: 'Hi, Zach'});
  });


  // TODO: add tests for your routes
  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: 12132, content: "some stuff"}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "content" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "L"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "content" was missing');

    // Third branch, straight line code
    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "some stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "different stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Called to clear all saved files created in this test
    //    to not effect future tests
    resetFilesForTesting();
  });

  it('load', function() {    
    // First branch, straight line code, error case
    const saveReq1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "An", content: "A"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const loadReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {}});
    const loadRes1 = httpMocks.createResponse();
    load(loadReq1, loadRes1);

    assert.deepStrictEqual(loadRes1._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes1._getData(),
        'required argument "name" was missing');

    const loadReq7 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: 1111, value: "lkcd"}});
    const loadRes7 = httpMocks.createResponse();
    load(loadReq7, loadRes7);

    assert.deepStrictEqual(loadRes7._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes7._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "A"}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);

    assert.deepStrictEqual(loadRes2._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes2._getData(),
        'no file previously saved with this name');

    resetFilesForTesting();
    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "An"}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);

    assert.deepStrictEqual(loadRes3._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes3._getData(),
        'no file previously saved with this name');

    // Third branch, straight line code
    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "Cjbchd", content: "cdddddddd"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Cjbchd"}});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);

    assert.deepStrictEqual(loadRes4._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes4._getData(),
        {name: "Cjbchd", content: "cdddddddd"});


    const saveReq3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "qqqqqpp", content: "Aaaaa"}});
    const saveResp3 = httpMocks.createResponse();
    save(saveReq3, saveResp3);

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "qqqqqpp"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);

    assert.deepStrictEqual(loadRes5._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes5._getData(),
        {name: "qqqqqpp", content: "Aaaaa"});      

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetFilesForTesting();
  });

  it('names', function() {
    // straight-line code
    const namesReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "A"}});
    const namesRes1 = httpMocks.createResponse();
    names(namesReq1, namesRes1);

    assert.deepStrictEqual(namesRes1._getStatusCode(), 200);
    assert.deepStrictEqual(namesRes1._getData(),
        {names: []});

    const saveReq1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "qqqqqpp", content: "Aaaaa"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "asd", content: "Aaacadvggaa"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const namesReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "A"}});
    const namesRes2 = httpMocks.createResponse();
    names(namesReq2, namesRes2);

    assert.deepStrictEqual(namesRes2._getStatusCode(), 200);
    assert.deepStrictEqual(namesRes2._getData(),
        {names: ["qqqqqpp", "asd"]});
  });
});
