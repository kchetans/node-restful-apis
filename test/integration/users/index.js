
import chai from "chai";
import chaiHttp from "chai-http";

let should = chai.should();
chai.use(chaiHttp);

describe('Users', () => {
    beforeEach(done => {
        UsersSchema.remove({}, (err) => {
            done();
        });
    });
});


