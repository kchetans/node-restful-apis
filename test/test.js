//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
import "babel-polyfill";
//server
//chai dependencies
import chai from "chai";
import chaiHttp from "chai-http";


import server from "../src/index";

//mongo models
let OTPSchema = require('../src/mongo-models/OtpSchema');
let UsersProfileSchema = require('../src/mongo-models/UsersProfileSchema');

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);


let sendOtp = async (mobile_no) => {
    return await chai.request(server)
        .post('/api/workexnow/v1/users/send-otp')
        .send({mobile_no})
};


let confirmOtp = async (mobile_no) => {
    return await chai.request(server)
        .post('/api/workexnow/v1/users/confirm-otp')
        .send({mobile_no, otp: "123456"})
};

//Our parent block
describe('Users', () => {

    describe('clear DB', async () => {
        await UsersProfileSchema.remove({});
        await OTPSchema.remove({});
    });

    let mobile_no = "9654013024";

    describe('/users/send-otp', () => {
        it('it should send otp', async () => {
            let res = await sendOtp(mobile_no);
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('data').and.to.be.a('object');
            expect(res.body).to.have.property('message').and.to.be.eql(`OTP send to no ${mobile_no}`);
            expect(res.body.data).to.have.property('is_new_user').and.to.be.eql(true);
        });
    });

    describe('/users/confirm-otp', () => {
        it('it should send otp', async () => {
            let mobile_no = "9654013024";
            let res = await confirmOtp(mobile_no);
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('data').and.to.be.a('object');
            expect(res.body).to.have.property('message').and.to.be.eql(`Otp verified`);
            expect(res.body.data).to.have.property('is_new_user').and.to.be.eql(true);
        });
    });
});